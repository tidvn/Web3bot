const { ChatInputCommandInteraction, SlashCommandBuilder,ModalBuilder,TextInputBuilder,TextInputStyle,ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('address')
        .setDescription('get change address'),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {
        
        const modal = new ModalBuilder()
            .setCustomId('getPaymentAddressModal')
            .setTitle('Verify');
        const passwordField = new TextInputBuilder()
            .setCustomId('passwordFieldInput')
            .setLabel("Your secret key:")
            .setStyle(TextInputStyle.Short);
        modal.addComponents(
            new ActionRowBuilder().addComponents(passwordField)
        );
        await interaction.showModal(modal);

    }
};
