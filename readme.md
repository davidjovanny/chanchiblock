<p align="center">

&nbsp; <img src="httpsD://URL\_DE\_TU\_LOGO\_CHANCHITO.png" width="150" alt="Chanchiblock Logo">

</p>



<h1 align="center">🐷 Chanchiblock</h1>



<p align="center">

&nbsp; <strong>A friendly, web-based Blockly editor for your ESP32 robot projects.</strong>

&nbsp; <br />

&nbsp; Most ESP32 block editors are... complicated. Chanchiblock makes it simple and fun.

</p>



<p align="center">

&nbsp; <a href="https://chanchiblock.netlify.app/"><strong>Try Chanchiblock Live! »</strong></a>

</p>



<p align="center">

&nbsp; <img alt="Status" src="https://img.shields.io/badge/status-in\_progress-yellow">

&nbsp; <img alt="License" src="https://img.shields.io/badge/license-MIT-green">

&nbsp; <img alt="Platform" src="https://img.shields.io/badge/platform-Windows-blue">

</p>



---



<p align="center">

&nbsp; <img src="httpsDEPRECATED\_PATH/screenshot.png" alt="Chanchiblock Interface Screenshot">

</p>



---



\## ✨ Features



\* \*\*Visual Programming:\*\* Easy drag-and-drop blocks powered by Blockly.

\* \*\*Robot Ready:\*\* Comes with pre-built blocks for Motors (L293D), Ultrasonic Sensors, and Servos.

\* \*\*Hybrid Power:\*\* Runs 100% in your browser, but uses a local server (`MiniFlasher`) for fast, reliable compiling and uploading.

\* \*\*No Setup Hell:\*\* The `MiniFlasher` package contains \*everything\* you need (Python, Arduino-CLI, ESP32 core, and esptool) in one portable folder.

\* \*\*Auto-Detect:\*\* Automatically finds your ESP32's COM port—no guessing needed!



\## 💡 How It Works



Chanchiblock uses a hybrid model to give you the best of both worlds:



1\.  \*\*The Website (This Repo):\*\* A static site (hosted on Netlify) provides the beautiful block editor interface.

2\.  \*\*The Local Server (`MiniFlasher`):\*\* A portable local server (that you download) securely handles the "heavy lifting" on your own computer—compiling your code and uploading it to the ESP32.



This means your browser does the fun stuff, and your PC does the hard work.



\## 🚀 How to Use (For Students)



Get started in 2 simple steps:



\### Step 1: Download \& Run the Local Server

\*(You only need to do this once.)\*



1\.  Go to the \*\*\*\* \*\*\[Releases page](https://github.com/YOUR-USERNAME/chanchiblock/releases)\*\*.

2\.  Download the `MiniFlasher\_Package.zip` file (it's ~910MB).

3\.  Unzip the folder anywhere you want (like your Desktop or Documents).

4\.  \*\*Install Drivers:\*\* Open the folder, right-click \*\*`INSTALAR\_DRIVERS.bat`\*\* and select \*\*"Run as administrator"\*\*.



\### Step 2: Program your Robot!

\*(Do this every time you want to code.)\*



1\.  \*\*Start the Server:\*\* In the `MiniFlasher\_Package` folder, right-click \*\*`START\_MiniFlasher.bat`\*\* and select \*\*"Run as administrator"\*\*. (A black window will appear—just minimize it).

2\.  \*\*Open Chanchiblock:\*\* Go to \*\*\[https://chanchiblock.netlify.app/](https://chanchiblock.netlify.app/)\*\*.

3\.  Build your code and hit the "Upload" button!



\## ⚖️ License

This project is open-source and available under the \[MIT License](LICENSE).


## 🐷 About the Chanchiblock Team

Chanchiblock was born out of frustration. We're a group of friends—**David, Claudio, Geny, and Kimmi**—who love making robots with the ESP32 but were tired of the existing block editors being buggy, complicated, or just... frustrating.

We believe that programming an ESP32 should be powerful, simple, and fun.

So, we built our own tool. We hope it saves you some time and helps you build awesome projects. Enjoy it! (¡Que la gocen!)

