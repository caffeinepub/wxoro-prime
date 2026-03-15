import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: ProductId;
    name: string;
    description: string;
    isActive: boolean;
    driveLink: string;
    category: string;
    price: bigint;
}
export type Time = bigint;
export type ProductId = bigint;
export interface Order {
    status: OrderStatus;
    userId: Principal;
    productId: ProductId;
    orderId: OrderId;
    timestamp: Time;
}
export type OrderId = bigint;
export interface UserProfile {
    name: string;
}
export enum OrderStatus {
    pending = "pending",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, description: string, price: bigint, driveLink: string, category: string): Promise<ProductId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmOrder(orderId: OrderId): Promise<void>;
    deleteProduct(id: ProductId): Promise<void>;
    editProduct(id: ProductId, name: string, description: string, price: bigint, driveLink: string, category: string, isActive: boolean): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyOrders(): Promise<Array<Order>>;
    getOrder(orderId: OrderId): Promise<Order>;
    getProduct(id: ProductId): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listActiveProducts(): Promise<Array<Product>>;
    placeOrder(productId: ProductId): Promise<OrderId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
