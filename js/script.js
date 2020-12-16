// register the service worker if available
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
        console.log('Successfully registered service worker', reg);
    }).catch(function(err) {
        console.warn('Error whilst registering service worker', err);
    });
}

function remove(val) {
    let timeZones = getTimeZonesFromLocalStore();
    if (timeZones == null || !(val in timeZones)) {
        return;
    }
    delete timeZones[val];
    setTimeZonesInLocalStore(timeZones);
}

function setTimeZonesInLocalStore(timeZones) {
    localStorage.setItem("custom-timezones", JSON.stringify(timeZones));
}

function getTimeZonesFromLocalStore() {
    let timeZones = localStorage.getItem("custom-timezones");
    timeZones = JSON.parse(timeZones);
    return timeZones;
}

$(document).ready(function(){
  defaultTZ = {
      UTC:"UTC",
      London:"Europe/London",
      Westcost:"America/Los_Angeles",
      Eastcoast:"America/New_York",
      Central:"America/Chicago",
  };
  $(".toast").toast('hide');
  init(defaultTZ);

  var t = setInterval(setTime, 1000);

  $("#add-timezone").click(function() {
    let name = $("#custom-name").val();
    let tz = $("#custom-tz").find(":selected").text();
    if (name == "" || tz == "") {
        $(".toast").toast('show');
        return;
    }
    let timeZones = getTimeZonesFromLocalStore();
    timeZones[name] = tz;
    setTimeZonesInLocalStore(timeZones);
  });

  $("#convert").click(function(){
    let val = $("#source").val();
    let zone = $("#timezone").val();
    if (zone == "Local") {
      $("#target").val(datetimeFormat(val));
    } else {
      $("#target").val(datetimeFormat(val, zone));
    }
  });



  function init(defaultTZ) {
    let availableTZ = availableTimeZones();
    for(i in availableTZ) {
        $("#custom-tz").append(`<option value="` + availableTZ[i] + `">` + availableTZ[i] + `</option>`);
    }

    let timeZones = getTimeZonesFromLocalStore();

    if (timeZones == null) {
        timeZones = {};
    }

    for(i in defaultTZ) {
        timeZones[i] = defaultTZ[i];
    }
    setTimeZonesInLocalStore(timeZones);

    let now = new Date();
    $("#source").val(datetimeFormat(now));
    $("#target").val(datetimeFormat(now, "UTC"));
  }

  function setTime() {
    let now = new Date();

    $("#time-widgets").html("");
    $("#time-widgets").append(`<div class="col-md-4 mb-3">
    <div class="card" style="width: 23rem;">
    <div class="card-header header-size">Local</div>
    <div class="card-body">
    <h4>` + datetimeFormat(now) + `</h4>
    </div>
    </div>
    </div>`);

    let timeZones = getTimeZonesFromLocalStore();
    for(i in timeZones) {
        if (i in defaultTZ) {
            $("#time-widgets").append(`<div class="col-md-4 mb-3">
            <div class="card" style="width: 23rem;">
            <div class="card-header header-size">`+ i +`</div>
            <div class="card-body">
            <h4>` + datetimeFormat(now, timeZones[i]) + `</h4>
            </div>
            </div>
            </div>`);
        } else {
            $("#time-widgets").append(`<div class="col-md-4 mb-3">
            <div class="card" style="width: 23rem;">
            <div class="card-header header-size">`+ i +`
            <button type="button" class="ml-2 mb-1 close" onclick="remove('` + i + `')">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="card-body">
            <h4>` + datetimeFormat(now, timeZones[i]) + `</h4>
            </div>
            </div>
            </div>`);
        }
    }
  }

  function availableTimeZones() {
      zones = moment.tz.names();
      return zones;
  }

  function datetimeFormat(time, zone="") {
      var format = 'YYYY/MM/DD HH:mm:ss ZZ';
      if (zone == "") {
        return moment(time, format).format(format);
      }
      return moment(time, format).tz(zone).format(format);
  }
});
