import ChatModel from "../models/chatModel.js";
import ChatHistoryModel from "../models/chatHistoryModel.js";
import Messages from "../models/messages.js";

export const createChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
}












function getRandomArbitrary(min, max) {
  return (Math.trunc(Math.random() * (max - min) + min)).toString()
}



const createChatRoomIfInexistent = async (me, partner, chatRoomKey) => {

  let final = 0
  const result1 = await ChatHistoryModel.findOne({ id: me.id, partnerId: partner.id })
  const result2 = await ChatHistoryModel.findOne({ id: partner.id, partnerId: me.id })

  if (result1 === null && result2 === null) {
    // create chat room & inform both

    console.log(`post key and convo `)

    try {
      const resp = await ChatHistoryModel.create({
        id: me.id,
        partnerId: partner.id,
        name: partner.name,
        photo: partner.photo,
        chatRoomKey: chatRoomKey
      })

      console.log(`created 1 : result : ${JSON.stringify(resp)}`);

      const resp2 = await ChatHistoryModel.create({
        id: partner.id,
        partnerId: me.id,
        name: me.name,
        photo: me.photo,
        chatRoomKey: chatRoomKey
      })

      console.log(`created 2 : result : ${JSON.stringify(resp2)}`);

      return resp
    } catch (ex) {
      console.log(`post key : error : ${ex}`)
      return { error: ex }
    }

  } else {
    final = result1 === null ? result2 : result1
  }

  return final
}



const checkUsersHaveChatHistory = async (me, partner) => {
  const result = await ChatHistoryModel.findOne({ id: me.id, partnerId: partner.id })
  return result
}


const getKeyAndConversations = async (me) => {
  try {
    const cursor = await ChatHistoryModel.find({ id: me.id })
    const count = await ChatHistoryModel.countDocuments()
    console.log(`count : ${count}, type:${typeof (count)}`)

    var list = []
    if (count >= 1) { cursor.forEach((item) => { list.push(item) }) }

    return list
  } catch (ex) {
    console.log(`get key : error : ${ex}`)
    return { error: ex }
  }
}


const postKeyAndConversation = async (me, partner, chatRoomKey) => {
  console.log(`post key and convo `)
  try {
    const resp = await ChatHistoryModel.create({ id: me.id, partnerId: partner.id, name: partner.name, photo: partner.photo, chatRoomKey: chatRoomKey })
    // console.log(`created chat : ${resp}`)
    return resp
  } catch (ex) {
    console.log(`post key : error : ${ex}`)
  }
}

export const onInteractionForChat = async (req, res) => {

  if (!req.body.me) return res.status(400).send({ error: 'your own data is missing' })
  if (!req.body.partner) return res.status(400).send({ error: `your chat partner's data is missing` })

  var conversations = {}
  var chatRoomKey = getRandomArbitrary(1, 1000000000)
  let me = req.body.me
  let partner = req.body.partner

  // crate chat room  if inexistent

  var postedConversation = await createChatRoomIfInexistent(me, partner, chatRoomKey)

  console.log(`conversation existing : ${postedConversation} `)

  // if no : genKey & POST default conversation
  // if (isConversationExisting === null) {
  //   conversations = await postKeyAndConversation(me, partner, chatRoomKey)
  //   console.log(`created chat r : ${conversations}`)
  // }

  //else {
  // GET all conversations of ME

  conversations = await getKeyAndConversations(me)
  // conversations = [...conversations, postedConversation]
  console.log(`got conversations : ${conversations} `)

  //}



  console.log(`conversations final : ${conversations}`)

  return res.status(201).send({ success: true, conversations: conversations })

}



export const myChatHistory = async (req, res) => {

  if (!req.body.me) return res.status(400).send({ error: 'your own data is missing' })

  var conversations = {}
  let me = req.body.me

  conversations = await getKeyAndConversations(me)

  console.log(`got conversations : ${conversations} `)

  console.log(`conversations final : ${conversations}`)

  return res.status(201).send({ success: true, conversations: conversations })

}









