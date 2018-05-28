var utils = require('../lib/helpers/utils');
var clc = require('cli-color');

var warn = clc.yellow;
var green = clc.green;

module.exports = function(RED) {


//----------------------------------------------------------------------------------------------------
function SlackListUsersNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    var global = this.context().global;
    var environment = 'production';

    this.bot = config.bot;
    this.botProduction = config.botProduction;
    this.track = config.track;
    this.config = RED.nodes.getNode(this.botProduction);

    if (this.config) {
      this.status({fill: 'red', shape: 'ring', text: 'disconnected'});
      node.chat = this.config.chat;
      if (node.chat) {
        this.status({fill: 'green', shape: 'ring', text: 'connected'});
      } else {
        node.warn('Missing or incomplete configuration in Slack Receiver');
      }
    } else {
      node.warn('Missing configuration in Slack Receiver');
    }

    // relay message
    var handler = function(msg) {
      node.send(msg);
    };
    RED.events.on('node:' + config.id, handler);

    // cleanup on close
    this.on('close',function() {
      RED.events.removeListener('node:' + config.id, handler);
    });

    this.on('input', function (message) {  
      this.listusers = config.listusers;
       
      var chatId = utils.getChatId(message);
      var messageId = utils.getMessageId(message);

      // check transport compatibility
      if (!utils.matchTransport(node, message)) {
        return;
      }
      console.log(this.listusers)
      let output=""
      let count=0;
	      node.chat.getOptions().client.users.list()
	      .then((res) => {
		//console.log(JSON.stringify(res,null,1))
		// `res` contains information about the members
		res.members.forEach((c) =>{ 
			output+="\n"+c.name+"  "+c.real_name+"   "+c.profile.email; 
			count++;
			//console.log(c.name)
		});
	      }).then((res) => {
		// try to get a plain string or number from config or payload or "message" variable
		// like dialogflow/recast
		// also try to get an array of messages from config and pick one randomly
		message.payload = {
		    type: 'message',
		    content: output+"\nCount ="+count,
		    chatId: chatId,
		    messageId: messageId,
		    inbound: false
		}; 
		// reply flag
		message.payload.options = {};
		// send out reply
		node.send(message);
	      }).catch(console.error); 
    }); // END On Input
  }; //End of Node
  RED.nodes.registerType('chatbot-slack-listusers', SlackListUsersNode);

};
