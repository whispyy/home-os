import { writable } from 'svelte/store'

export interface Service {
  name: string
  url: string
  imgUrl?: string
  description?: string
  favorite?: boolean
}

export const DEFAULT_SERVICES: Service[] = JSON.parse(import.meta.env.VITE_DEFAULT_SERVICES || '[]')

const stored: Service[] = localStorage.getItem('services') ? JSON.parse(localStorage.getItem('services') || '[]') : DEFAULT_SERVICES
export const services = writable<Service[]>(stored)

services.subscribe((value) => localStorage.setItem('services', JSON.stringify(value)))