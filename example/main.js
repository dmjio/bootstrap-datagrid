$(function(){

var items = [{ JobId: "0001",
              Charge: 5,
              Created: "2014-02-25T04:07:43.451Z",
              Finished: null,
              From: "Version 2013",
              JobSize: "large..",
              Files : "many",
              Quote: 12,
              Status: "Pending",
              To: "Version 2014" },
              { JobId: "0002",
              Charge: 0,
              Created: "2013-02-25T04:07:43.451Z",
              Finished: null,
              From: "Version 2012",
              JobSize: "large..",
              Files : "many",
              Quote: 12,
              Status: "Success",
              To: "Version 2011" },
              { JobId: "0003",
              Charge: 0,
              Created: "2012-02-25T04:07:43.451Z",
              Finished: null,
              From: "Version 2012",
              JobSize: "large..",
              Files : "many",
              Quote: 12,
              Status: "Success",
              To: "Version 2011" },
              { JobId: "0004",
              Charge: 0,
              Created: "2015-02-25T04:07:43.451Z",
              Finished: null,
              From: "Version 2012",
              JobSize: "large..",
              Files : "many",
              Quote: 12,
              Status: "Success",
              To: "Version 2011" },
              { JobId: "0005",
              Charge: 0,
              Created: "2014-02-25T04:07:43.451Z",
              Finished: null,
              From: "Version 2012",
              JobSize: "large..",
              Files : "many",
              Quote: 1,
              Status: "Success",
              To: "Version 2011" },
              { JobId: "0006",
              Charge: 0,
              Created: "2014-02-25T04:07:43.451Z",
              Finished: null,
              From: "Version 2012",
              JobSize: "large..",
              Files : "many",
              Quote: 12,
              Status: "Success",
              To: "Version 2011" }
            ]

  var booGridSettings = {
    data : items,
    hasHover : true,
    isResponsive : true,
    isStriped : true,
    isCondensed : false,
    isBordered : true,
    idField : "JobId", /* This is needed to lookup a row's corresponding JSON object */
    title : "Bootstrap 3 DataGrid",
    filterBy : [ "JobId", "Status", "To"], /* search criteria for search box, does straight text matching */
    searchCaseInsensitive: true, /* cool feature to add, but not working yet.. */
    displayCounts : [2,4,5,items.length],
    getURL : "/index", /* ajax method called on refresh */
    startingDisplayCount : 6,
    order : ["JobId", "From", "To", "Charge", "Quote", "Status", "JobSize", "Created","Finished"],
    sortable : { "JobId" : true /* will default to False */
               , "Charge" : true
               , "Created" : true 
               , "From" : true
               , "To" : true
               , "Quote" : true
               , "Status" : true
               }, 
    responsiveHiding : { "JobSize"  : ["xs", "sm"]
                       , "Finished" : ["xs", "sm"] 
                       , "Charge"   : ["xs"]
                       , "To"       : ["xs"]
                       , "From"     : ["xs"]
                       },
    sortCols : { /* this is for custom sorting, all fields defined to
    be sortable will use underscores default sorting function, o/w you
    can override w/ your own custom sorting function here */
      "Charge" : function(a,b) { return b.Charge - a.Charge; },
      "JobId" : function(a,b) { return b.JobId.localCompare(a.JobId);   }
    },
    formatCols : {
      "Finished" : function(date) {
        if (!date) return "N/A"
        return new Date(date).toLocaleString();
      },
      "From" : function(from) {
        var year = from.split(' ')[1],
        from = from.split(' ')[0];
        return from + ' <span class="label label-primary"> ' +  year + '</span>';
      },
      "Status" : function(status) {
        switch (status) {
          case "Pending" : return ' <span class="label label-primary"> ' + status + '</span>';
          case "Success" : return ' <span class="label label-success"> ' + status + '</span>';
          case "InProcess" : return ' <span class="label label-warning"> ' + status + '</span>';
        };
        return '<span class="label label-warning">Unknown</span>';
      },
      "To" : function(to) {
        var year = to.split(' ')[1],
        to = to.split(' ')[0];
        return to + ' <span class="label label-success"> ' +  year + '</span>';
      },
      "Quote" : function(quote) { return "$" + quote.toFixed(2);  },
      "Charge" : function(charge) { return "$" + charge.toFixed(2);   },
      "Created" : function(date) { return new Date(date).toLocaleString();  }
    },
    searchPlaceholder : "Search by JobId (\"0001\"), Status (\"Pending, Success\"), or Version (\"2010, 2015\")",
    rowClick : function(obj) {
      /* callback function for row, could use this to pull down a modal for a details view */
      console.log(obj);
    }
  };

  $("#myGrid").boogrid(booGridSettings);
});
