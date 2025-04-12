import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: 
        "https://th.bing.com/th/id/OIP.fZVVRXfiDuZLTuIlHzufsgHaHa?w=171&h=194&c=7&r=0&o=5&dpr=1.1&pid=1.7",}
},
 { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;