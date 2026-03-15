import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ProductId = Nat;
  type OrderId = Nat;

  type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat; // INR
    driveLink : Text;
    category : Text;
    isActive : Bool;
  };

  type Order = {
    orderId : OrderId;
    userId : Principal;
    productId : ProductId;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
  };

  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<ProductId, Product>();
  let orders = Map.empty<OrderId, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextProductId = 1;
  var nextOrderId = 1;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management (Admin-only)
  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Nat, driveLink : Text, category : Text) : async ProductId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can add products");
    };

    let product : Product = {
      id = nextProductId;
      name;
      description;
      price;
      driveLink;
      category;
      isActive = true;
    };

    products.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public shared ({ caller }) func editProduct(id : ProductId, name : Text, description : Text, price : Nat, driveLink : Text, category : Text, isActive : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can edit products");
    };

    let product : Product = {
      id;
      name;
      description;
      price;
      driveLink;
      category;
      isActive;
    };

    products.add(id, product);
  };

  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete products");
    };

    products.remove(id);
  };

  // Public product listing (no authentication required)
  public query func listActiveProducts() : async [Product] {
    let activeProducts = List.empty<Product>();
    for ((_, product) in products.entries()) {
      if (product.isActive) {
        activeProducts.add(product);
      };
    };
    activeProducts.toArray();
  };

  // Public product details (no authentication required)
  public query func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Order Management
  public shared ({ caller }) func placeOrder(productId : ProductId) : async OrderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (not product.isActive) {
          Runtime.trap("Product is not available");
        };

        let order : Order = {
          orderId = nextOrderId;
          userId = caller;
          productId;
          status = #pending;
          timestamp = Time.now();
        };

        orders.add(nextOrderId, order);
        nextOrderId += 1;
        order.orderId;
      };
    };
  };

  public shared ({ caller }) func confirmOrder(orderId : OrderId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can confirm orders");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = {
          order with status = #confirmed
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    let myOrders = List.empty<Order>();
    for ((_, order) in orders.entries()) {
      if (order.userId == caller) {
        myOrders.add(order);
      };
    };
    myOrders.toArray();
  };

  public query ({ caller }) func getOrder(orderId : OrderId) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Only the order owner or admin can view the order
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };
};
