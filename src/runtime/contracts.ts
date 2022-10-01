// *eslint-disable */
import { defineNuxtPlugin, useAppConfig, useState, useNuxtApp } from '#app'
import Web3 from 'web3'
import type { ContratsPlugin, Cacheinstances, DefineContract, MetaMaskPluginType, Abis, CacheinstancesResults } from './types'

export default defineNuxtPlugin((app) => {
    const __cache:Cacheinstances = {}
    const __results:CacheinstancesResults = {}
    const __listeners:{[key:string]:Function[]} = {}

    const triggeListeners = (name:string) => {
        if (__listeners[name]) {
            __listeners[name].forEach((callback, index) => {
                if (callback) { callback(name) }
                __listeners[name].splice(index, 1)
            })
        }
    }

    const Contracts:ContratsPlugin = {
        define: (name:string, abi:Abis, address: string, providerURI?:string) => {
            if (__cache[name]) {
                throw new TypeError(`Contract ${name} already defined`)
            }

            let Contract

            if (providerURI) {
                Contract = (new Web3(new Web3.providers.HttpProvider(providerURI))).eth.Contract
            } else {
                const $metamask: MetaMaskPluginType = app.$metamask
                Contract = $metamask.useWeb3().eth.Contract
            }

            const contract = new Contract(abi, address)
            __cache[name] = contract
            triggeListeners(name)
            return contract
        },
        get: (name:string) => {
            if (!__cache[name]) {
                throw new TypeError(`Contract ${name} not defined`)
            }
            return __cache[name]
        },
        call: async (name:string, method:string, args?:any[], options?:{}, cache?:boolean) => {
            if (!__cache[name]) {
                throw new TypeError(`Contract ${name} not defined`)
            }

            if (cache && __results[name] && __results[name][method]) {
                return __results[name][method]
            }

            if (args && !(args instanceof Array)) { args = [args] }

            const contract = Contracts.get(name)
            return await contract.methods[method](...(args ?? [])).call(options ?? {}).then((result) => {
                if (cache) {
                    if (!__results[name]) {
                        __results[name] = {}
                    }
                    __results[name][method] = result
                }
                return result
            })
        },
        send: async (name:string, method:string, args?:any[], options?:{}, cache?:boolean) => {
            if (!__cache[name]) {
                throw new TypeError(`Contract ${name} not defined`)
            }
            if (args && !(args instanceof Array)) { args = [args] }

            if (cache && __results[name] && __results[name][method]) {
                return __results[name][method]
            }
            const contract = Contracts.get(name)
            return await contract.methods[method](...(args ?? [])).send(options ?? {}).then((result) => {
                if (cache) {
                    if (!__results[name]) {
                        __results[name] = {}
                    }
                    __results[name][method] = result
                }
                return result
            })
        },
        abi: (name:string, method:string, args?:any[], options?:{}, cache?:boolean) => {
            if (!__cache[name]) {
                throw new TypeError(`Contract ${name} not defined`)
            }
            const contract = Contracts.get(name)
            return contract.methods[method](...(args ?? [])).encodeABI(options ?? {})
        },
        address: (name:string) => {
            if (!__cache[name]) {
                throw new TypeError(`Contract ${name} not defined`)
            }
            return __cache[name].options.address
        },
        isDefined: (name:string) => {
            return !!__cache[name]
        },
        remove: (name:string) => {
            delete __cache[name]
        },
        on (name:string, callback:Function) {
            if (Contracts.isDefined(name)) {
                if (callback) { callback(name) }
            } else {
                if (!__listeners[name]) {
                    __listeners[name] = []
                }
                __listeners[name].push(callback)
            }
        }
    }

    app.provide('contracts', Contracts)
 })
