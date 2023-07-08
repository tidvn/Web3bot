
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle,EmbedBuilder } = require('discord.js');
const UserSchema = require('../../schemas/UserSchema');
const { AppWallet, KoiosProvider } = require("@meshsdk/core");
const CryptoJS = require("crypto-js");
module.exports = {
	event: 'interactionCreate',
	run: async (client, interaction) => {


		if (interaction.isButton() && interaction.customId == 'walletRestoreButton') {
			const modal = new ModalBuilder()
				.setCustomId('walletRestoreModal')
				.setTitle('Restore a Cardano wallet');
			const mnemonicField = new TextInputBuilder()
				.setCustomId('mnemonicFieldInput')
				.setLabel("Recovery Phrase (separated by a space):")
				.setStyle(TextInputStyle.Paragraph);

			const passwordField = new TextInputBuilder()
				.setCustomId('passwordFieldInput')
				.setLabel("Your secret key:")
				.setStyle(TextInputStyle.Short);


			modal.addComponents(
				new ActionRowBuilder().addComponents(mnemonicField),
				new ActionRowBuilder().addComponents(passwordField)
			);
			await interaction.showModal(modal);

		}
		if (interaction.isButton() && interaction.customId == 'walletCreateButton') {
			const modal = new ModalBuilder()
				.setCustomId('walletCreateModal')
				.setTitle('Create a Cardano wallet');
			const passwordField = new TextInputBuilder()
				.setCustomId('passwordFieldInput')
				.setLabel("Your secret key:")
				.setStyle(TextInputStyle.Short);


			modal.addComponents(
				new ActionRowBuilder().addComponents(passwordField)
			);
			await interaction.showModal(modal);

		}
		if (interaction.isModalSubmit() && interaction.customId == 'walletRestoreModal') {
			const mnemonicField = interaction.fields.getTextInputValue('mnemonicFieldInput');
			const passwordField = interaction.fields.getTextInputValue('passwordFieldInput');

			const userData = await UserSchema.findOne({ userId: interaction.user.id }) || new UserSchema({ userId: interaction.user.id });
			if (!mnemonicField || !passwordField) {
				await interaction.reply({ content:`You need to provide the secret key.`, ephemeral: true });
				return;
			};
			try {
				const mnemonic = mnemonicField.split(" ")
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
				const passwordKey = CryptoJS.enc.Utf8.parse(Buffer.from(passwordField).toString('base64'));
				const encrypted = CryptoJS.AES.encrypt(mnemonicField, passwordKey, { mode: CryptoJS.mode.ECB }).toString();
				userData.stakeAddr = await wallet.getRewardAddress();
				userData.mnemonicHash = encrypted
				userData.save()
				await interaction.reply({ content: 'Complete!', ephemeral: true });
			} catch (e) {
				await interaction.reply({ content: e.message, ephemeral: true });
			}
		}
		if (interaction.isModalSubmit() && interaction.customId == 'walletCreateModal') {
			const passwordField = interaction.fields.getTextInputValue('passwordFieldInput');
			const userData = await UserSchema.findOne({ userId: interaction.user.id }) || new UserSchema({ userId: interaction.user.id });
			if (!passwordField) {
				await interaction.reply({ content:`You need to provide the secret key.`, ephemeral: true });
				return;
			};
			try {
				const mnemonic = AppWallet.brew()
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
				const passwordKey = CryptoJS.enc.Utf8.parse(Buffer.from(passwordField).toString('base64'));
				const encrypted = CryptoJS.AES.encrypt(mnemonic.join(" "), passwordKey, { mode: CryptoJS.mode.ECB }).toString();
				userData.stakeAddr = await wallet.getRewardAddress();
				userData.mnemonicHash = encrypted
				userData.save()
				const  mnemonicString= mnemonic.map(element => `\`${element}\``).join(' ');

				const embed = new EmbedBuilder()
				.setTitle('Please store your recover word carefully, this message is only displayed once:')
				.setDescription(mnemonicString)
				await interaction.reply({ embeds: [embed], ephemeral: true });
				} catch (e) {
				await interaction.reply({ content: "you do not have a personal wallet or the secret key is not correct", ephemeral: true });
			}
		}

	}
};