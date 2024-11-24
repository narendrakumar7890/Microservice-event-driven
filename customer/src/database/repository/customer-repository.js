const mongoose = require("mongoose");
const { CustomerModel, AddressModel } = require("../models");
const { FormateData, PublishShoppingEvent } = require("../../utils");

//Dealing with data base operations
class CustomerRepository {
  async CreateCustomer({ email, password, phone, salt }) {
    const customer = new CustomerModel({
      email,
      password,
      salt,
      phone,
      address: [],
    });

    const customerResult = await customer.save();
    return customerResult;
  }

  async CreateAddress({ _id, street, postalCode, city, country }) {
    const profile = await CustomerModel.findById(_id);

    if (profile) {
      const newAddress = new AddressModel({
        street,
        postalCode,
        city,
        country,
      });

      await newAddress.save();

      profile.address.push(newAddress);
    }

    return await profile.save();
  }

  async FindCustomer({ email }) {
    const existingCustomer = await CustomerModel.findOne({ email: email });
    return existingCustomer;
  }

  async FindCustomerById({ id }) {
    const existingCustomer = await CustomerModel.findById(id).populate(
      "address"
    );
    // existingCustomer.cart = [];
    // existingCustomer.orders = [];
    // existingCustomer.wishlist = [];

    // await existingCustomer.save();
    return existingCustomer;
  }

  async setWishlistToCart(customerId, productId) {
    const profile = await CustomerModel.findById(customerId);

    if (profile && profile.wishlist.length > 0) {
      const wishlist = profile.wishlist;
      wishlist.map((item) => {
        if (item._id.toString() === productId.toString()) {
          const { _id, name, price, banner } = item;
          let payload = {
            event: "ADD_TO_CART",
            data: {
              userId: customerId,
              product: { _id, name, price, banner },
              qty: 1,
            },
          };

          let isExist = false;
          if (profile.cart.length > 0) {
            profile.cart.map((itemCart) => {
              if (itemCart.product._id.toString() === productId.toString()) {
                itemCart.unit += 1;
                isExist = true;
                payload.data.qty = itemCart.unit;
              }
            });
          }
          console.log("isExist: ", isExist);
          if (!isExist) {
            const cartItem = {
              product: { _id, name, price, banner },
              unit: 1,
            };
            profile.cart.push(cartItem);
          }

          PublishShoppingEvent(payload);

          wishlist.splice(wishlist.indexOf(item), 1);
        }
      });

      const profileResult = await profile.save();

      return profileResult;
    } else {
      throw new Error("Unable to move from wishlist to cart!");
    }
  }

  async Wishlist(customerId) {
    const profile = await CustomerModel.findById(customerId).populate(
      "wishlist"
    );

    return profile.wishlist;
  }

  async AddWishlistItem(
    customerId,
    { _id, name, desc, price, available, banner }
  ) {
    const product = {
      _id,
      name,
      desc,
      price,
      available,
      banner,
    };

    const profile = await CustomerModel.findById(customerId).populate(
      "wishlist"
    );

    if (profile) {
      let wishlist = profile.wishlist;

      if (wishlist.length > 0) {
        let isExist = false;
        wishlist.map((item) => {
          if (item._id.toString() === product._id.toString()) {
            const index = wishlist.indexOf(item);
            wishlist.splice(index, 1);
            isExist = true;
          }
        });

        if (!isExist) {
          wishlist.push(product);
        }
      } else {
        wishlist.push(product);
      }

      profile.wishlist = wishlist;
    }

    const profileResult = await profile.save();

    return profileResult.wishlist;
  }

  async AddCartItem(customerId, { _id, name, price, banner }, qty, isRemove) {
    //const profile = await CustomerModel.findById(customerId).populate("cart");
    // console.log("customerId: ", customerId);
    // console.log("name: ", name);
    // console.log("price: ", price);
    // console.log("banner: ", banner);
    // console.log("qty: ", qty);
    // console.log("isRemove: ", isRemove);
    const profile = await CustomerModel.findById(customerId);
    //console.log("profile: ", profile);
    if (profile) {
      const cartItem = {
        product: { _id, name, price, banner },
        unit: qty,
      };

      let cartItems = profile.cart;

      if (cartItems.length > 0) {
        let isExist = false;
        cartItems.map((item) => {
          if (item.product._id.toString() === _id.toString()) {
            if (isRemove) {
              cartItems.splice(cartItems.indexOf(item), 1);
            } else {
              item.unit = qty;
            }
            isExist = true;
          }
        });

        if (!isExist) {
          cartItems.push(cartItem);
        }
      } else {
        cartItems.push(cartItem);
      }

      profile.cart = cartItems;
      const cartSaveResult = await profile.save();

      return cartSaveResult;
    }

    throw new Error("Unable to add to cart!");
  }

  async AddOrderToProfile(customerId, order) {
    const profile = await CustomerModel.findById(customerId);
    console.log("AddOrderToProfile profile: ", profile);
    if (profile) {
      if (profile.orders == undefined) {
        profile.orders = [];
      }
      profile.orders.push(order);

      profile.cart = [];

      const profileResult = await profile.save();

      return profileResult;
    }

    throw new Error("Unable to add to order!");
  }

  async setPayload(userId, product, qty, event) {
    //const product = await this.repository.FindById(productId);

    if (product) {
      const payload = {
        event: event,
        data: { userId, product, qty },
      };
      console.log("setPayload payload: ", payload);
      return FormateData(payload);
    } else {
      return FormateData({ error: "No product available" });
    }
  }
}

module.exports = CustomerRepository;
