
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle,EmbedBuilder } = require('discord.js');
const UserSchema = require('../../schemas/UserSchema');
const { AppWallet, KoiosProvider } = require("@meshsdk/core");
const CryptoJS = require("crypto-js");
module.exports = {
	event: 'interactionCreate',
	run: async (client, interaction) => {
		if (interaction.isModalSubmit() && interaction.customId == 'getPaymentAddressModal') {
			const passwordField = interaction.fields.getTextInputValue('passwordFieldInput');
			let userData = await UserSchema.findOne({userId: interaction.user.id })
			if (!userData) {
                await interaction.reply({ content: `you don't have a wallet, please use !setup to create a personal wallet`, ephemeral: true });
            return;
            }
            if (!passwordField) {
				await interaction.reply({ content:`You need to provide the secret key.`, ephemeral: true });
				return;
			};
			try {
                
				const mnemonicHash = userData.mnemonicHash
                const key = CryptoJS.enc.Utf8.parse(Buffer.from(passwordField).toString('base64'));
                const mnemonicString = CryptoJS.AES.decrypt(mnemonicHash, key,{mode: CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8);
                const mnemonic = mnemonicString.split(" ")
				const blockchainProvider = new KoiosProvider("preprod")
				const wallet = new AppWallet({
					networkId: 0,
					fetcher: blockchainProvider,
					submitter: blockchainProvider,
					key: {
						type: 'mnemonic',
						words: mnemonic,
					},
				});


				address = await wallet.getPaymentAddress();

				const embed = new EmbedBuilder()
				.setTitle('Your Wallet')
				.setDescription(address)
				await interaction.reply({ embeds: [embed], ephemeral: true });
				} catch (e) {
				await interaction.reply({ content: e.message, ephemeral: true });
			}
		}

	}
};