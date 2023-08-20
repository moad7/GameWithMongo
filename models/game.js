import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    genreId: {type: mongoose.Schema.Types.ObjectId, ref: 'Genre'},
    gameName: String,
    gamePrice: String,
    isAvailable: {type:Boolean, default:true},
    gameDescription: String,
    gameBackgroundImage:String
})

export default mongoose.model('Game', gameSchema);