//osnovno
const Discord = require('discord.js');
const Canvas = require('canvas');   //for welcome image
const prefix = "!";
const token = "";

const client = new Discord.Client();


//-------------------- BOT READY --------------------
client.on('ready', () => {
    console.log('Bot je online');
});

client.on('message', message => {
	if (message.content === '!join') {
		client.emit('guildMemberAdd', message.member);
	}
});

client.on('message', message => {
	if (message.content === '!leave') {
		client.emit('guildMemberRemove', message.member);
	}
});
//-------------------- NEW MEMBER & LEFT SERVER --------------------
client.on('guildMemberAdd', async member =>{ 
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    if (!channel) return;

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    //switch za sliku
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
      }
    var broj = getRandomInt(1, 6);
    var slika = '';
    switch(broj) {
        case 1: slika = './images/img1.jpg'; break;
        case 2: slika = './images/img2.jpg'; break;
        case 3: slika = './images/img3.jpg'; break;
        case 4: slika = './images/img4.jpg'; break;
        case 5: slika = './images/img5.jpg'; break;
        case 6: slika = './images/img6.jpg'; break;
      }
    const background = await Canvas.loadImage(slika.toString());
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#e60000';

    //brojac membera
    const guild = client.guilds.cache.get('789095389450076202');  //ID DIKORD SERVERA
    const memberi = guild.memberCount;

    //jos nesto za membere
    const memberTag = member.user.tag; //naziv sa tagom
    
    //text iznad
    ctx.font = 'bold 35px verdana';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Member No.', canvas.width / 2.5, canvas.height / 3.5);
    ctx.strokeText('Member No.', canvas.width / 2.5, canvas.height / 3.5);
    //user new
    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
        let fontSize = 60;
        do {
            ctx.font = `bold ${fontSize -= 10}px verdana`;
            }
        while ((ctx.measureText(memberTag).width)> canvas.width - 300);
        return ctx.font;
    }; //DDA TEXT BUDE U CANVASU NON STOP
    ctx.font = applyText(canvas, member.displayName);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(memberTag, canvas.width / 2.5, canvas.height / 1.8);
    ctx.strokeText(memberTag, canvas.width / 2.5, canvas.height / 1.8);
    //text ispod
    ctx.font = 'bold 35px verdana';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('joined', canvas.width / 2.5, canvas.height / 1.3);
    ctx.strokeText('joined', canvas.width / 2.5, canvas.height / 1.3);
    
    
    //avatar
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg', dynamic: true }));
    ctx.drawImage(avatar, 25, 25, 200, 200);
    //avatar stroke
    const avatarstr = canvas.getContext('2d');
    avatarstr.beginPath();
    avatarstr.strokeStyle = '#ffffff';
    avatarstr.lineWidth = 10;
    avatarstr.arc(125, 125, 100, 0, Math.PI * 2, true);
    avatarstr.stroke();
       
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    channel.send(`Welcome, ${member}`, attachment);
});

client.on('guildMemberRemove', async member =>{ 
  const channel = member.guild.channels.cache.find(ch => ch.name === 'left-server');
  if (!channel) return;
  let tag = member.user.tag;
  channel.send(`User **`+tag+`** just left the server! Bye bye....`);
});

//-------------------- COMMANDS --------------------
client.on('message', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const guild = client.guilds.cache.get('789095389450076202'); //OVDE IDE ID SERVERA

    //-------------------- FOR ALL --------------------
    if(command === 'rules') {
      const rules = new Discord.MessageEmbed()
        .setColor('#ff0000')//red
        .setTitle('Pravila diskord servera')
        .setDescription('1. Ne vređajte i ne uznemiravajte članove diskorda na bilo koji način.\n2. Ne šaljite privatno drugim korisnicima reklame, spam ili diskord invite za druge servere.\n3. Ne ne počinjite diskusije zasnovane na politici, rasi ili religiji.\n4. Ne šaljite diskord linkove od drugih servera ili game servera u chat.\n5. Ne vičite, ne tapkajte u mikrofon i ne puštajte muziku preko njega ako to smeta drugim igračima.\n6.Ne spamujte tekst kanale bot komandama. Imaju posebni kanali za to.\n7. Pokušajte da ograničite psovke.')
        .setThumbnail('https://i.imgur.com/0Ty2pLI.jpg')
        .setTimestamp()
        .setFooter('JaKiMa BOT', 'https://i.imgur.com/0Ty2pLI.jpg');
      message.channel.send(rules);
    }//EMBED
    if(command === 'ping') {
      const m = await message.channel.send("Ping?");
      const pingEmbed = new Discord.MessageEmbed()
        .setColor('#ff6600')//orange
        .setTitle('JaKiMa BOT')
        .setThumbnail('https://i.imgur.com/0Ty2pLI.jpg')
        .addFields(
          { name: 'Latency is:', value: `${m.createdTimestamp - message.createdTimestamp}ms`},
          { name: 'API Latency is:', value: `${Math.round(client.ws.ping)}ms`},
        )
        .setTimestamp()
        .setFooter('JaKiMa BOT', 'https://i.imgur.com/0Ty2pLI.jpg');
      m.edit(pingEmbed);
    }//EMBED
    
    if(command === 'server'){
      const guild = client.guilds.cache.get('789095389450076202');  //ID DIKORD SERVERA

      const serverEmbed = new Discord.MessageEmbed()
          .setColor('#0099ff') //blue
          .setTitle('JaKiMa BOT')
          .setDescription('About our diskord server')
          .setThumbnail('https://i.imgur.com/0Ty2pLI.jpg')
          .addFields(
            { name: 'Total members', value:`${guild.memberCount}`, inline: true},
            { name: 'Members', value: `${message.guild.members.cache.filter(member => !member.user.bot).size}`, inline: true},
            { name: 'Bots', value: `${message.guild.members.cache.filter(member => member.user.bot).size}`, inline: true},
            { name: 'Verification', value: `${message.guild.verificationLevel}`, inline: true},
            { name: 'Region', value: ':flag_eu: Central Europe', inline: true},
            { name:"Creation Date", value: `${message.channel.guild.createdAt.toUTCString().substr(0, 16)}`, inline: true}
          )
          .setTimestamp()
          .setFooter('JaKiMa BOT', 'https://i.imgur.com/0Ty2pLI.jpg');
      message.channel.send(serverEmbed);
    }//EMBED
    if(command === "answer") {
        let start = args[0]; //will, should, can, who, 5th
        let randomMessage = '';
        if(start == "will"){
            let messages = [
                "Seriously?! You thought I would reply.", 
                "hm, yeh thats a pretty random question - Don't ya think?", 
                "Ok I'm actually running out of options now...", 
                "Please stop asking me!!!", 
                "Ok, im done!",
                "Yeah, ofcourse you will!",
                "Nope, no way."
            ];
            randomMessage = messages[Math.floor(Math.random() * Math.floor(messages.length))];
        }
        else if(start == "should"){
            let messages = [
            "Yes.",
            "Nope.",
            "You definitely should!",
            "You definitely should (not)!",
            "Yeah, it will pay off"
            ];
        randomMessage = messages[Math.floor(Math.random() * Math.floor(messages.length))];
        }
        else if(start == "can"){
          let messages = [
            "Yes.",
            "Nope.",
            "Why not?",
            "If you dont try you'll never know.",
            "Doubt."
          ];
          randomMessage = messages[Math.floor(Math.random() * Math.floor(messages.length))];
          }
          else if(start == "who"){
            let messages = [
              "It's someone you know.",
              "I don't know.",
              "Why are you asking me???",
              "I won't tell you.",
              "Ask your friends.",
              "In the end it doesn't even matter..."
            ];
          randomMessage = messages[Math.floor(Math.random() * Math.floor(messages.length))];
          }
        else if(start == "when"){
          let messages = [
            "Never.",
            "Tomorrow.",
            "When pigs fly.",
            "Right about... now."
          ];
        randomMessage = messages[Math.floor(Math.random() * Math.floor(messages.length))];
        }
        message.reply(randomMessage);
    }
    //-------------------- SPEC PERMISSION --------------------
    if(command === 'help'){
      if(message.member.roles.cache.some(r=>["Admin"].includes(r.name))){
        const pomocEmbed = new Discord.MessageEmbed()
            .setColor('#5cd65c')//greenish
            .setTitle('JaKiMa BOT')
              .setDescription('Commands you can use')
              .setThumbnail('https://i.imgur.com/0Ty2pLI.jpg')
            .addFields(
                { name: '!', value: 'bot prefix'},
                { name: 'rules', value: 'show you the rules on server' },
                { name: 'ping', value: 'gets your ping'},
                { name: 'server', value: 'about server' },
                { name: 'kick', value: 'kick member' },
                { name: 'ban', value: 'ban member' },
                { name: 'purge', value: 'delete messages' },
                { name: 'help', value: 'all commands you can use' },
            )
            .setTimestamp()
            .setFooter('JaKiMa BOT', 'https://i.imgur.com/0Ty2pLI.jpg');
            message.channel.send(pomocEmbed);
        }
      else {
        const pomocEmbed = new Discord.MessageEmbed()
            .setColor('#5cd65c')
            .setTitle('JaKiMa BOT')
              .setDescription('Commands you can use')
              .setThumbnail('https://i.imgur.com/0Ty2pLI.jpg')
            .addFields(
              { name: '!', value: 'bot prefix'},
              { name: 'rules', value: 'show you the rules on server' },
              { name: 'ping', value: 'gets your ping'},
              { name: 'server', value: 'about server' },
              { name: 'help', value: 'all commands you can use' }
            )
            .setTimestamp()
            .setFooter('JaKiMa BOT', 'https://i.imgur.com/0Ty2pLI.jpg');
            message.channel.send(pomocEmbed);
        }
    }//EMBED

    if(command === "kick") {
      if(!message.member.roles.cache.some(r=>["Admin"].includes(r.name)))
          return message.reply("Sorry, you don't have permissions to use this!");
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if(!member) return message.reply("Please mention a valid member of this server");
      if(!member.kickable) return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
     
      let reason = args.slice(1).join(' ');
      if(!reason) reason = "No reason provided";
      
      await member.kick(reason).catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
      
      const kickEmbed = new Discord.MessageEmbed()
          .setColor('#ff0000')
          .setTitle('JaKiMa Kick')
          .setDescription('Member has been kicked:')
          .setThumbnail('https://i.imgur.com/0Ty2pLI.jpg')
          .addFields(
            { name: 'kicked member:', value: `${member.user.tag}`},
            { name: 'kicked by:', value: `${message.author.tag}`},
            { name: 'kick reason', value: `${reason}`})
          .setTimestamp()
          .setFooter('JaKiMa BOT', 'https://i.imgur.com/0Ty2pLI.jpg');
      message.channel.send(kickEmbed);
      console.log();
    }//EMBED

    if(command === "ban") {
      if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Invalid Permissions");
      let User = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
      if (!User) return message.reply("Please mention a valid member of this server");
      if (User.hasPermission("BAN_MEMBERS")) return message.reply("Invalid Permissions");
      let banReason = args.join(" ").slice(22);
      if (!banReason) {
        banReason = "None";
      }
      
      User.ban({reason: banReason});
      const banEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('JaKiMa BOT')
        .setDescription('A member has been banned:')
        .setThumbnail('https://i.imgur.com/0Ty2pLI.jpg')
        .addFields(
          { name: 'banned member:', value: `${User.user.tag}`},
          { name: 'banned by:', value: `${message.author.tag}`},
          { name: 'ban reason', value: `${banReason}`})
        .setTimestamp()
        .setFooter('JaKiMa BOT', 'https://i.imgur.com/0Ty2pLI.jpg');

        message.channel.send(banEmbed);  
    }//EMBED

    if(command === "purge") {
      if(!message.member.roles.cache.some(r=>["Admin"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
        
        const deleteCount = parseInt(args[0], 10);
        
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
        
        const fetched = await message.channel.messages.fetch({limit: deleteCount});
        message.channel.bulkDelete(fetched).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
});    
//-------------------- SERVER LOGS -----------------
client.on("channelCreate", async function(channel){
  let guild = client.guilds.cache.get('789095389450076202');
  let LOGchannel = guild.channels.cache.find(ch => ch.name === 'logs');
  ch = channel.name;
  const AuditLogFetch = await channel.guild.fetchAuditLogs({limit: 1, type: "CHANNEL_CREATE"});
  const entry = AuditLogFetch.entries.first();
  const { executor, target } = entry;
  if (target.id === channel.id)
    LOGchannel.send(`Channel ${target} was created by ${executor}.`);
  else
  LOGchannel.send(`Channel ${channel} was created.`);
});

client.on("channelDelete", async function(channel){
  let guild = client.guilds.cache.get('789095389450076202');
  let LOGchannel = guild.channels.cache.find(ch => ch.name === 'logs');
  ch = channel.name;
  const AuditLogFetch = await channel.guild.fetchAuditLogs({limit: 1, type: "CHANNEL_DELETE"});
  const entry = AuditLogFetch.entries.first();
  const { executor, target } = entry;
  if (target.id === channel.id)
    LOGchannel.send(`Channel **#`+ch+`** was deleted by ${executor}.`);
  else
  LOGchannel.send(`Channel **#`+ch+`** was deleted.`);
});

client.on("channelPinsUpdate", function(channel, time){
  let guild = client.guilds.cache.get('789095389450076202');
  let LOGchannel = guild.channels.cache.find(ch => ch.name === 'logs');
  LOGchannel.send(`Channel ${channel} pins were updated!`);
  console.log(`channelPinsUpdate: ${channel}:${time}`);
});

client.on("guildBanAdd", async function(guild, user){
  let LOGchannel = guild.channels.cache.find(ch => ch.name === 'logs');
  const AuditLogFetch = await guild.fetchAuditLogs({limit: 1,	type: 'MEMBER_BAN_ADD',	});
  const banLog = AuditLogFetch.entries.first();	
	const { executor, target } = banLog;
	if (target.id === user.id) 
    LOGchannel.send(`**${user.tag}** was banned by **${executor.tag}**`);
});

client.on("guildBanRemove", async function(guild, user){
  let LOGchannel = guild.channels.cache.find(ch => ch.name === 'logs');
  const AuditLogFetch = await guild.fetchAuditLogs({limit: 1,	type: 'MEMBER_BAN_ADD',	});
  const banLog = AuditLogFetch.entries.first();	
	const { executor, target } = banLog;
	if (target.id === user.id) 
    LOGchannel.send(`**${user.tag}** was unbanned by **${executor.tag}**`);
});

client.login(token); //token na kraju uvek mora da bude
