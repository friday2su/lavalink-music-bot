const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('clear the queue'),
    
    async execute(interaction) {
        const player = interaction.client.kazagumo.players.get(interaction.guildId);
        const member = interaction.member;
        
        if (!player || !player.playing) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(':x: No music is currently playing!')],
                ephemeral: true
            });
        }
        
        // Check if user is in voice channel
        if (!member.voice.channel) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(':x: You need to be in a voice channel to skip music!')],
                ephemeral: true
            });
        }
        
        // Check if user is in the same voice channel as bot
        const botChannel = interaction.guild?.members?.me?.voice?.channel;
        if (botChannel && member.voice.channel.id !== botChannel.id) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(':x: You need to be in the same voice channel as the bot!')],
                ephemeral: true
            });
        }
        
        const currentTrack = player.current;
        
        if (player.queue.length === 0) {
            player.destroy();
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#00ff00')
                    .setDescription(':stop_button: No more songs in queue. Stopped the player!')]
            });
        }
        
        player.queue.clear();
        
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle(':track_next: queue cleared') // :wrench: FIXED QUOTE
            .setDescription(`Skipped **${currentTrack?.title || 'Unknown'}**`)
            .addFields(
                { name: ':clipboard: Queue', value: `queue cleared`, inline: true },
                { name: ':bust_in_silhouette: cleared by', value: interaction.user.toString(), inline: true }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    },
};
