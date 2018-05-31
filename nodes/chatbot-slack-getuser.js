var utils = require('../lib/helpers/utils');

module.exports = function(RED) {


//----------------------------------------------------------------------------------------------------
function SlackGetUserNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    
    var global = this.context().global;
    var environment = this.context().global.environment === 'production' ? 'botProduction' : 'bot';
    this.bot = config[environment];
    this.config = RED.nodes.getNode(this.bot);
    this.userField = config.field

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
      this.config = RED.nodes.getNode(this.bot);
      let chatId = utils.getChatId(message);
      let messageId = utils.getMessageId(message);
      let fieldValue = message.grok[this.userField]
      //console.log(message.grok)
      // check transport compatibility
      if (!utils.matchTransport(node, message)) {
        return;
      }
      let output="-"
      let count=0;
      if ( fieldValue.match("^<@") ){
	      let id = fieldValue.match(/<\@(\w+)>/) ;
	      //console.log(fieldValue+"="+id)
	      node.chat.getOptions().client.users.info(id[1])
	      .then((response) =>{
		  message.userinfo = response;
		  node.send(message);
	      }).catch(console.error);
      } else if ( fieldValue.match("<mailto:") ){
	      let id = fieldValue.match("<mailto:(.+)\\|.+>") ;
	      node.chat.getOptions().client.users.lookupByEmail(id[1])
	      .then((response) =>{
		  message.userinfo = response;
		  node.send(message);
	      }).catch(console.error);
      } else {
	 message.userinfo = {
		type: "error",
		message: "Not Email address, or Slack @user"
	 }
	 node.send(message);
      }
    }); // End On Input
  }; //End of Node
  RED.nodes.registerType('chatbot-slack-getuser', SlackGetUserNode);

};
