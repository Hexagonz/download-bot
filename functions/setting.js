import
	{
	MessageType,
	} from "@adiwajshing/baileys";
import { hexa } from './connect.js';
import ffmpeg from 'fluent-ffmpeg';
import Axios from 'axios';
import * as fs from 'fs';
import { exec } from "child_process";
import * as Hx from './download.js';

export class Setting  {

Wait = 'Loading...'
Menu = `
*Hai Kak Saya HexaBot*

*Berikut Menu HexaBot*

*Sticker*
*Sticker To Image*
*Youtube Download*
*Instagram Download*
*Tiktok Download*
*Twitter Download*
*MediaFire Download*
`
Note = `
*NOTE:*
*~ Hanya Kirimkan Link Yang Ingin di Download*   
*~ Kirim Gambar Yang Ingin di Jadikan Sticker <Khusus PC Bot>*
*~ Kirim Sticker Yang Ingin di Jadikan Gambar <Khusus PC Bot>*
`
YtIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:|watch\?.*(?:|\&)v=|embed\/|v\/|shorts\/)|youtu\.be\/)([-_0-9A-Za-z]{11}|[-_0-9A-Za-z]{10})/
IgIdRegex = /(?:http(?:s|):\/\/|)(?:www\.|)(?:instagram.com)\/(?:p|tv|reel)\/(?:[-_0-9A-Za-z]{11})\/?.(?:[=_a-zA-Z]{19,27})/
TwitIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|mobile\.|))(?:twitter\.com)\/([a-zA-Z0-9-_\.]{3,20})\/(?:status)\/([?=0-9a-z]{15,25})([a-zA-Z=0-9]{3,6})/
TtIdRegex = /(?:http(?:s|):\/\/|)(?:www\.|)(?:tiktok.com)\/@([-_0-9A-Za-z\.]{3,20})\/video\/([0-9]{19,25})?.(?:sender_device=pc&sender_web_id=[0-9]{19,25})&.(?:s_from_webapp=v1&is_copy_url=[0-9]{1})|(?:http(?:s|)):\/\/(?:(?:vt.|vm.)tiktok.com)\/(?:[a-z0-9A-Z]{9,15}\/)|(?:http(?:s|)):\/\/(?:t.tiktok.com)\/(?:i18n\/share\/video)\/([&\?\/a-zA-Z0-9=_-]{333,400})/
MediaIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|))mediafire\.com\/(?:file)\/(?:[-_a-zA-Z0-9]{15,20})\/(?:[0-9a-zA-Z_.-]{1,100})\/(?:file|)|(?:http(?:s|):\/\/|)(?:(?:www\.|))mediafire\.com\/(?:download)\/([a-zA-Z0-9_]{15,20})/

async Function(m) {
	m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
	m.chats = (Object.keys(m.message)[0] === 'conversation') ? m.message.conversation : (Object.keys(m.message)[0] === 'extendedTextMessage') ? m.message.extendedTextMessage.text : (Object.keys(m.message)[0] === 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedDisplayText : ''
	m.id = m.key.remoteJid
	m.Group = m.id.endsWith('@g.us')
	m.Gc = m.Group ? await hexa.groupMetadata(m.id) : ''
	m.NamaGC = m.Group ?  m.Gc.subject : ''
	m.From = m.NamaGC ? m.NamaGC : m.id
	return m
}

BalasYt(Link) { 
	return `*Size Terlalu Besar!!!*\n*Silahkan Download Secara Manual*\n*Gunakan Link di Bawah*\n${Link}`
}

async balas(id,teks,m) {
	await hexa.sendMessage(id,teks,MessageType.text,{quoted:m})
}

async button(id,teks,id1,id2 ,foots = 'HexaBot') {
		let buttons = [
				{buttonId: 'id1', buttonText: {displayText: id1}, type: 1},
				{buttonId: 'id2', buttonText: {displayText: id2}, type: 1}
			  ]
			  
				let buttonMessage = {
				  contentText: teks,
				  footerText: foots,
				  buttons: buttons,
				  headerType: 1
			  }
			  
			await hexa.sendMessage(id, buttonMessage, MessageType.buttonsMessage)
}

async sendSticker(id,data,file,m) {
			await ffmpeg(data).input(data).on('error', function (err) {
			console.log(`Error : ${err}`)
			fs.unlinkSync(data)
			balas(id,'Error',m)
			}).on('end', async function () {
			console.log('Finish')
			await hexa.sendMessage(id, fs.readFileSync(file), MessageType.sticker, {quoted: m})
			fs.unlinkSync(data)
			fs.unlinkSync(file)
			})
			.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
			.toFormat('webp')
			.save(file)
}

async ConvertMedia(id,data,file, cap = '',m) {
			exec(`ffmpeg -i ${data} ${file}`, async(err) => {
			if (!err) {
			let buffer = fs.readFileSync(file)
			await hexa.sendMessage(id,buffer,MessageType.image,{quoted:m,caption:cap})
			fs.unlinkSync(file)
			fs.unlinkSync(data)
			} else {
			let file = await Hx.Webp2gifFile(data)
			await hexa.sendMessage(id,{url: file.result},MessageType.video,{quoted:m,caption:cap})
			fs.unlinkSync(data)
			}
		})
}

sendFileUrl(id,Url,type,cap = '',file = '',m) {
			Axios.get(Url,  { responseType: 'arraybuffer' })
			.then(async({ data }) => {
			await hexa.sendMessage(id,Buffer.from(data, "utf-8"),type,{quoted:m,caption: cap,filename: file})
			})
}
}