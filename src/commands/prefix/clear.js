const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clear',
    aliases: ['clear-q', 'q-clear'],
    description: 'clear the queue',
    usage: 'clear',
    voiceChannel: true,
    guildOnly: true,
    
    async execute(message) {
        const player = message.client.kazagumo.players.get(message.guildId);
        
        if (!player || !player.playing) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription('❌ No music is currently playing!')
                ]
            });
        }
        
        const currentTrack = player.current;
        
        if (player.queue.length === 0) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#00ff00')
                        .setDescription('⏹️ There are no songs to clear from the queue!')
                ]
            });
        }
        
        player.queue.clear();
        
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('queue cleared') // ✅ FIXED
            .setDescription(`now playing **${currentTrack?.title || 'Unknown'}**`)
            .addFields(
                { name: '📋 Queue', value: `0 song(s) remaining`, inline: true },
                { name: '👤 cleared by', value: message.author.toString(), inline: true }
            )
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    },
};
