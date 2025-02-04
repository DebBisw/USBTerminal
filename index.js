let usbDevice;

document.addEventListener("deviceready", onDeviceReady, false);

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.querySelector(".loading-screen").style.display = "none";
    document.getElementById("main-content").classList.remove("hidden");
  }, 3000);
});

function onDeviceReady() {
  document.getElementById("status").innerText =
    "Device ready. Waiting for USB HID connection...";

  if (!window.USBHID) {
    document.getElementById("status").innerText =
      "USB HID API not supported on this device.";
    return;
  }

  window.USBHID.requestPermission()
    .then(() => {
      document.getElementById("status").innerText =
        "Permission granted. Searching for devices...";
      return window.USBHID.getDevices();
    })
    .then((devices) => {
      if (devices.length > 0) {
        usbDevice = devices[0];
        document.getElementById("status").innerText =
          "USB HID device connected!";
        addDeviceInfo();
        openDevice();
      } else {
        document.getElementById("status").innerText =
          "No USB HID devices found.";
      }
    })
    .catch((error) => {
      document.getElementById("status").innerText =
        "Permission denied: " + error.message;
    });
}

function addDeviceInfo() {
  let deviceInfo = document.createElement("div");
  deviceInfo.className = "device-box";
  deviceInfo.innerText =` Device 1 - Connected: ${new Date().toLocaleString()}`;
  document.getElementById("device-list").appendChild(deviceInfo);
}

function openDevice() {
  if (!usbDevice) {
    document.getElementById("status").innerText =
      "No device found. Unable to open device.";
    return;
  }

  usbDevice
    .open()
    .then(() => {
      document.getElementById("status").innerText =
        "Device opened. Listening for data...";
      listenForData();
    })
    .catch((error) => {
      document.getElementById("status").innerText =
        "Error opening device: " + error.message;
    });
}

function listenForData() {
  if (!usbDevice) return;

  usbDevice.oninputreport = function (event) {
    const data = new Uint8Array(event.data.buffer);
    const receivedData = String.fromCharCode.apply(null, data);

    document.getElementById("console").value += `\nReceived: ${receivedData}`;
  };
}
function formatData(rawData){

}
function sendCommand() {
  let command = document.getElementById("input").value.trim();
  if (command === "") return;
  command = command.split(',')
  let encoder = new TextEncoder();

  if (usbDevice) {
    for (let i = 0; i < command.length; i++) {
      usbDevice
      .sendFeatureReport(0, encoder.encode(command[i]))
      .then(() => {
        document.getElementById("console").value +=` \nSent: ${command}`;
        document.getElementById("input").value = "";
      })
      .catch((error) => {
        document.getElementById(
          "console"
        ).value +=` \nError sending data: ${error.message}`;
      });      
    }
  } else {
    alert("No USB device connected!");
  }
}
// for toggling the menu button

function toggleMenu() {
  let menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".menu-container")
    .addEventListener("click", function (event) {
      event.stopPropagation(); // Prevents the click from propagating
      toggleMenu();
    });
});
document
  .querySelector(".menu-container")
  .addEventListener("click", function (event) {
    event.stopPropagation();
    toggleMenu();
  });

document.addEventListener("click", function (event) {
  let menu = document.getElementById("menu");
  if (menu.style.display === "block" && !menu.contains(event.target)) {
    menu.style.display = "none";
  }
});

// for baud rate section



// Terminal and menu logic
let currentDevice = null;
let baudRate = 19200;
let parity = "None";
let dataBits = 8;
let stopBits = 1.0;

// Function to toggle the selection of the clicked item
function toggleSelection(event) {
    const clickedElement = event.target; // Get the element that was clicked
    if (clickedElement.classList.contains('selected')) {
        clickedElement.classList.remove('selected'); // Remove the 'selected' class if it exists
    } else {
        clickedElement.classList.add('selected'); // Add the 'selected' class if it doesn't exist
    }
}
// Modal open/close and setting changes
function openBaudRateModal() {
    document.getElementById("baudRateModal").classList.add("show");
}

function selectBaudRate(rate) {
    baudRate = rate;
    document.getElementById("baudRateModal").classList.remove("show");
}

function openDataBitsModal() {
    document.getElementById("dataBitsModal").classList.add("show");
}

function selectDataBits(bits) {
    dataBits = bits;
    document.getElementById("dataBitsModal").classList.remove("show");
}

function openParityModal() {
    document.getElementById("parityModal").classList.add("show");
}

function selectParity(selectedParity) {
    parity = selectedParity;
    document.getElementById("parityModal").classList.remove("show");
}

function openStopBitsModal() {
    document.getElementById("stopBitsModal").classList.add("show");
}

function selectStopBits(bits) {
    stopBits = bits;
    document.getElementById("stopBitsModal").classList.remove("show");
}

// Close modals
function closeBaudRateModal() {
    document.getElementById("baudRateModal").classList.remove("show");
}

function closeParityModal() {
    document.getElementById("parityModal").classList.remove("show");
}

function closeDataBitsModal() {
    document.getElementById("dataBitsModal").classList.remove("show");
}

function closeStopBitsModal() {
    document.getElementById("stopBitsModal").classList.remove("show");
}

// Handling the changes to the status or display text for the selected values
function updateStatus() {
    document.getElementById("status").innerText = `Baud Rate: ${baudRate}, Parity: ${parity}, Data Bits: ${dataBits}, Stop Bits: ${stopBits}`;
}

// Event listeners to handle changes when selecting options
document.querySelectorAll(".baud-rate-option").forEach(button => {
    button.addEventListener("click", function() {
        selectBaudRate(button.getAttribute("data-value"));
        updateStatus();
    });
});

document.querySelectorAll(".data-bits-option").forEach(button => {
    button.addEventListener("click", function() {
        selectDataBits(button.getAttribute("data-value"));
        updateStatus();
    });
});

document.querySelectorAll(".parity-option").forEach(button => {
    button.addEventListener("click", function() {
        selectParity(button.getAttribute("data-value"));
        updateStatus();
    });
});

document.querySelectorAll(".stop-bits-option").forEach(button => {
    button.addEventListener("click", function() {
        selectStopBits(button.getAttribute("data-value"));
        updateStatus();
    });
});

// Navigation

function goToOutputPage() {
    // Redirect to the output page
    window.location.href = "Nav.html"; // Replace 'output.html' with your output page URL
}
// Function to refresh the page
function refreshPage() {
  location.reload(); // Reloads the current page
}

