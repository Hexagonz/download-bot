import
	{
	MessageType,
	} from "@adiwajshing/baileys";
import { starts } from './functions/connect.js';
import * as Hx from './functions/download.js';
import { Setting } from './functions/setting.js';
import { Konsol } from './functions/console.js';
let { Wait, Menu, Note, YtIdRegex, IgIdRegex, TwitIdRegex, TtIdRegex, MediaIdRegex, balas, button, sendSticker, ConvertMedia, BalasYt, sendFileUrl, } = new Setting()
let session = './session.json';

export let hexa = async (hexa, m,prefix) => {
	try {     
        let { chats, id, Group, From } = m
        let { audio, video, document, image } = MessageType
        if (chats.toLowerCase() === 'bot' || chats.match('@6282158722305') || chats.startsWith(`${prefix}help`)) {
                        Konsol('Menu','MENU BOT',From)
                        button(id,Menu,'OWNER','HOW TO USE')
        } else if (Object.keys(m.message)[0] == 'imageMessage' || Object.keys(m.message)[0] == 'videoMessage') {
                        if(Group) return
                        Konsol('Sticker',Object.keys(m.message)[0] == 'imageMessage' ? 'Sticker' : 'Sticker GIF',From)
                        balas(id,Wait,m)
                        let data = await hexa.downloadAndSaveMediaMessage(m)
                        let file = 'stiker'
                        sendSticker(id,data,file,m)
        } else if (Object.keys(m.message)[0] == 'stickerMessage') {
                        if(Group) return
                        Konsol('To Media','stickerMessage',From)
                        balas(id,Wait,m)
                        let data = await hexa.downloadAndSaveMediaMessage(m)
                        let file = 'image.png'
                        await ConvertMedia(id,data,file,'HexaBot',m)
        } else if (YtIdRegex.test(chats)) {
                        Konsol('Youtube',YtIdRegex.exec(chats)[0],From)
                        balas(id,Wait,m)
                        let buffer = await Hx.Youtube(YtIdRegex.exec(chats)[0])
                        let desc = `
*ID* : ${buffer.id}
*Title* : ${buffer.title}

*Silahkan di Pilih MP3/MP4*`
                        button(id,desc,'MP3','MP4',YtIdRegex.exec(chats)[0])
        } else if (IgIdRegex.test(chats)) {
                        Konsol('Instagram',IgIdRegex.exec(chats)[0],From)
                        balas(id,Wait,m)
                        let buffer = await Hx.Igdl(IgIdRegex.exec(chats)[0])
                        for (let i of buffer ? buffer : buffer.medias){
                        if(i.url.includes('.mp4')){
                        sendFileUrl(id,i.url,video,'HexaBot','',m)
                        } else {
                        sendFileUrl(id,i.url,image,'HexaBot','',m)     
                        }
                }
        } else if (TtIdRegex.test(chats)) {
                        Konsol('Tiktok',TtIdRegex.exec(chats)[0],From)
                        balas(id,Wait,m)
                        let teks = `
*Silahkan di Pilih*
*WaterMark/Without WaterMark*`
                        button(id,teks,'WM','NO WM',TtIdRegex.exec(chats)[0]) 
        } else if (MediaIdRegex.test(chats)) {
                        Konsol('MediaFire',MediaIdRegex.exec(chats)[0],From)
                        balas(id,Wait,m)
                        let buffer = await Hx.Mediafire(MediaIdRegex.exec(chats)[0])
                        let teks = `
*Title* : ${buffer.title}
*Size* : ${buffer.size}
*Upload* : ${buffer.upload}`
                        balas(id,teks,m)
                        sendFileUrl(id,buffer.link,document,'',buffer.title,m)
        } else if (TwitIdRegex.test(chats)){
                        Konsol('Twitter',TwitIdRegex.exec(chats)[0],From)
                        balas(id,Wait,m)
                        let { result,title } = await Hx.Twitter(TwitIdRegex.exec(chats)[0])
                        if(result == undefined) return balas(id,'error',m)
                        if(result.endsWith('mp4')){
                        sendFileUrl(id,result,video,title,'',m)
                        } else {
                        sendFileUrl(id,result,image,title,'',m)                                
                        }
        }
        switch(chats) {
                case 'MP3':
                        balas(id,Wait,m)
                        let respon =  m.message.buttonsResponseMessage.contextInfo.quotedMessage.buttonsMessage.footerText
                        let buffer = await Hx.Youtube(YtIdRegex.exec(respon)[0])
                        sendFileUrl(id,buffer.mp3,audio,'',buffer.title,m)
                break
                case 'MP4':
                        balas(id,Wait,m)
                        let _respon =  m.message.buttonsResponseMessage.contextInfo.quotedMessage.buttonsMessage.footerText
                        let _buffer = await Hx.Youtube(YtIdRegex.exec(_respon)[0])
                        if(Number(_buffer.vid_size >= 30000)) return balas(id,BalasYt(_buffer.link),m)
                        sendFileUrl(id,_buffer.link,video,_buffer.title,'',m)
                break
                case 'WM':
                        balas(id,Wait,m)
                        let respon_ =  m.message.buttonsResponseMessage.contextInfo.quotedMessage.buttonsMessage.footerText
                        let buffer_ = await Hx.Ttdownloader(TtIdRegex.exec(respon_)[0])
                        sendFileUrl(id,buffer_.wm,video,'HexaBot','',m)
                break
                case 'NO WM':
                        balas(id,Wait,m)
                        let respon__ =  m.message.buttonsResponseMessage.contextInfo.quotedMessage.buttonsMessage.footerText
                        let buffer__ = await Hx.Ttdownloader(TtIdRegex.exec(respon__)[0])
                        sendFileUrl(id,buffer__.nowm,video,'HexaBot','',m)
                break
                case 'OWNER':
                        const vcard = 'BEGIN:VCARD\n' 
                        + 'VERSION:3.0\n' 
                        + 'FN:Hexa\n' 
                        + 'ORG:Hexagon;\n' 
                        + 'TEL;type=CELL;type=VOICE;waid=6285751056816:+62 857-5105-6816\n' 
                        + 'END:VCARD'
                        await hexa.sendMessage(id, {displayname: "Hexa", vcard: vcard}, MessageType.contact)
                break
                case 'HOW TO USE':
                        balas(id,Note,m)
                break
        default:
        }
    } catch(e){
        console.log(e)
    }
}
starts(session)