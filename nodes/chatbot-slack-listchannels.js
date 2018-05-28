var utils = require('../lib/helpers/utils');
var clc = require('cli-color');

var warn = clc.yellow;
var green = clc.green;

module.exports = function(RED) {


//----------------------------------------------------------------------------------------------------
function SlackListChannelsNode(config) {
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
      this.listchannels = config.listchannels;
       
      var chatId = utils.getChatId(message);
      var messageId = utils.getMessageId(message);

      // check transport compatibility
      if (!utils.matchTransport(node, message)) {
        return;
      }
      console.log(this.listchannels)
      let output=""
      let count=0;
	      node.chat.getOptions().client.channels.list()
	      .then((res) => {
		//console.log(JSON.stringify(res,null,1))
		/************************************************
		   {
		   "id": "",
		   "name": "",
		   "is_channel": true,
		   "created": 1516035114,
		   "is_archived": false,
		   "is_general": false,
		   "unlinked": 0,
		   "creator": "",
		   "name_normalized": "",
		   "is_shared": false,
		   "is_org_shared": false,
		   "is_member": false,
		   "is_private": false,
		   "is_mpim": false,
		   "members": [],
		   "topic": {
		    "value": "",
		    "creator": "",
		    "last_set": 0
		   },
		   "purpose": {
		    "value": "",
		    "creator": "",
		    "last_set": 1516035115
		   },
		   "previous_names": [],
		   "num_members": 5
		  },
		*************************************************/
		// `res` contains information about the channels
		res.channels.forEach((c) =>{ 
			output+="\n"+c.name+"  "+c.num_members; 
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
  RED.nodes.registerType('chatbot-slack-listchannels', SlackListChannelsNode);


};
