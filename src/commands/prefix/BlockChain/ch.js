const { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
// const {mnemonic} = require("../../../config").blockchain;
// const {AppWallet,KoiosProvider} = require("@meshsdk/core");
module.exports = {
    structure: {
        name: 'ch',
        description: 'test blockchain',
        aliases: ['ch']
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {
        // const blockchainProvider = new KoiosProvider("preprod");
        // const appWallet = new AppWallet({
        // networkId: 0,
        // fetcher: blockchainProvider,
        // submitter: blockchainProvider,
        // key: {
        //     type: "mnemonic",
        //     words: mnemonic,
        // },
        // });
        // const address = await appWallet.getPaymentAddress();

        const walletRestore = new ButtonBuilder()
			.setCustomId('walletRestoreButton')
			.setLabel(' Restore a wallet')
			.setStyle(ButtonStyle.Success);
        const walletCreate = new ButtonBuilder()
			.setCustomId('walletCreateButton')
			.setLabel('Create a wallet')
			.setStyle(ButtonStyle.Danger);

		const row = new ActionRowBuilder()
            .addComponents(walletRestore)
			.addComponents(walletCreate);


        if (!message.author.bot) await message.author.send({
			content: `Walet init`,
			components: [row],
		});

    }
}