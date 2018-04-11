var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        registerBroadcastReceiver();
    },

    onResume: function()
    {
        //console.log('Resumed');
        registerBroadcastReceiver();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();

function registerBroadcastReceiver()
{
  window.plugins.intentShim.registerBroadcastReceiver({
  filterActions: [
   'com.zebra.datawedgecordova.ACTION'
  ],
  filterCategories: [
   'com.android.intent.category.DEFAULT'
  ]
  },
   function(intent) {
   //  Broadcast received
   console.log('Received Intent: ' + JSON.stringify(intent.extras));
   if (intent.extras["com.symbol.datawedge.data_string"] != null)
  {

    document.getElementById('broadcastData').innerHTML = intent.extras["com.symbol.datawedge.data_string"];
    document.getElementById('btnScan').click();
    //innerHTML
  }
  }
  );
}
