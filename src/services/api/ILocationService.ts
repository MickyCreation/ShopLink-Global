import { Address, LocationPermissionStatus } from '../../types';

export interface NigerianLocationArea {
  id: string;
  name: string;
  state: string;
  city: string;
  isPopularMarket: boolean;
  coordinates: { lat: number; lng: number };
}

export interface ILocationService {
  getPermissionStatus(): Promise<LocationPermissionStatus>;
  requestPermission(): Promise<LocationPermissionStatus>;
  getCurrentPosition(): Promise<{ lat: number; lng: number; areaName: string } | null>;
  getSavedAddresses(userId: string): Promise<Address[]>;
  saveAddress(userId: string, address: Omit<Address, 'id'>): Promise<Address>;
  deleteAddress(userId: string, addressId: string): Promise<boolean>;
  setDefaultAddress(userId: string, addressId: string): Promise<boolean>;
  getOperationalAreas(): Promise<NigerianLocationArea[]>;
}
