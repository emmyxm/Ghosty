const { Client, LocalAuth, Buttons } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { chromium } = require('playwright');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: chromium.executablePath(),
        headless: true,
        args: ['--no-sandbox']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ GHOST Bot is ready!');
    const chatId = '2347056900563@c.us';
    const autoMessage = '👻 GHOST bot is now live and watching...';
    try {
        await client.sendMessage(chatId, autoMessage);
        console.log(`📤 Auto-message sent: ${autoMessage}`);
    } catch (err) {
        console.error('❌ Error sending message:', err.message);
    }
});

client.on('message', async message => {
    const msg = message.body.toLowerCase();
    const chat = await message.getChat();

    if (msg === 'hi' || msg === 'hello') {
        return message.reply("👋 GHOST is online. Type !menu to begin.");
    }

    if (msg === '!menu') {
        const button = new Buttons('Choose a command:', [
            { body: '!prank' },
            { body: '!tagall' },
            { body: '!!prank' },
            { body: '!welcome' }
        ], '👻 GHOST Bot Menu', 'Pick one:');
        return client.sendMessage(message.from, button);
    }

    if (msg === '!prank') {
        const prank = '😈Z͑͛͐Z͗̐̿̈́̀͸͙͍͚ͅA̍͐͂̒̄Ḻ̡̮̞̯ͤͣ͂G͓̟̐O͒͗́😈';
        return message.reply(prank.repeat(3));
    }

    if (msg === '!!prank') {
        const prank = '😈Z͑͛͐Z͗̐̿̈́̀͸͙͍͚ͅA̍͐͂̒̄Ḻ̡̮̞̯ͤͣ͂G͓̟̐O͒͗́😈';
        return message.reply(prank.repeat(50000)); // ⚠ Heavy load for testing
    }

    if (msg === '!tagall' && chat.isGroup) {
        let text = '👥 Tagging everyone:\\n';
        let mentions = [];

        for (let p of chat.participants) {
            const contact = await client.getContactById(p.id._serialized);
            mentions.push(contact);
            text += `@${p.id.user} `;
        }

        return chat.sendMessage(text, { mentions });
    }

    if (msg === '!welcome') {
        return message.reply('👋 Welcome! Type !menu to explore GHOST bot.');
    }
});

client.initialize();