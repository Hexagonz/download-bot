import {
    WAConnection
} from '@adiwajshing/baileys';
import * as fs from 'fs';
import { run } from './console.js';
import * as Hx from '../handler.js';
import { Setting } from './setting.js';
import Chalk from 'chalk';
let { Function } = new Setting()

export let hexa = new WAConnection()

export const starts = async (json) => {
    hexa.logger.level = 'warn'
    hexa.version = [2, 2123, 8]
    hexa.browserDescription = [ 'Hexagonz', 'Chrome', '3.0' ]
    hexa.on('qr', () => {
        console.log(Chalk.redBright('Scan bang'))
    })
    fs.existsSync(json) && hexa.loadAuthInfo(json)
    run('Bot|Download')
    hexa.on('connecting', () => {
        console.info((Chalk.greenBright('Connecting')))
    })
    hexa.on('open', () => {
        console.info(Chalk.greenBright('Connected'))
    })
    await hexa.connect({timeoutMs: 30*1000})
        fs.writeFileSync(json, JSON.stringify(hexa.base64EncodedAuthInfo(), null, '\t'))

    hexa.on('chat-update', async (m) => {
        if (!m.hasNewMessage) return
        m = m.messages.all()[0]
        if (!m.message) return
        if (m.key.fromMe) return
        if (m.key.remoteJid == 'status@broadcast') return  
        m = await Function(m)
        let prefix = /[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©]/.test(m.chats) ? m.chats.match(/[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©]/) : ''
        Hx.hexa(hexa, m, prefix)
    })
}
