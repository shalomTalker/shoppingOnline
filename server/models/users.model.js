const Users = require('./schemas/users.schema');

module.exports = {
    all: () => {
        return Users.find();
    },
    create: (userObj) => {
        let User = new Users(userObj);
        return User.save();
    },
    byEmail: (email) => {
        return Users.findOne({email:email});
    },
    byId: (id) => {
        return Users.findOne({_id:id});
    },
    update: (id,userObj) => {
        let user = new Users(userObj);
        user._id = id;
        return Users.update({_id:id},user); 
    },
    getRole: (id) => {
        return Users.findOne({_id:id},'role');
    },
    deleteUser: (id) => {
        return Users.deleteOne({_id:id});
    },
    updateLastOrder: async(lastOrder) => {
        return Users.update({_id: lastOrder.id}, {
            $push: {
                "orders": { orderID: lastOrder.oid, date: lastOrder.date }
            }
        });
    }
}