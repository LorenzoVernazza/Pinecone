### Version 1.3.6, 28-5-2019
	
#### &nbsp;&nbsp;<b>Changes:</b>
* If a toString() method is defined now it has priority over object inspection.

---
### Version 1.3.5, 27-5-2019

### &nbsp;&nbsp;<b>Fixes & optimizations:</b>
* Fixed secrets with non-string values not working as intended.
---
### Version 1.3.4, 27-5-2019

#### &nbsp;&nbsp;<b>Fixes & optimizations:</b>
* Minor optimization for secrets with empty mask.
* Fix for BR element.
---
### Version 1.3.3, 24-5-2019

#### &nbsp;&nbsp;<b>Changes:</b>
* Reverted .br to a class so can be converted to string.
#### &nbsp;&nbsp;<b>Fixes & optimizations:</b>
* Fixed error with non-string secrets.
---
### Version 1.3.2, 23-5-2019

#### &nbsp;&nbsp;<b>Fixes & optimizations:</b>
* Fixed error in timers with Node.js versions prior 11
---
### Version 1.3.0, 20-5-2019
#### &nbsp;&nbsp;<b>Changes:</b>

* Added Timers ([see documentation](https://github.com/LorenzoVernazza/Pinecone/blob/master/README.md#timers))
* Updated TypeScript definitions
---
### Version 1.2.0, 6-5-2019
#### &nbsp;&nbsp;<b>Changes:</b>

* Added Secrets ([see documentation](https://github.com/LorenzoVernazza/Pinecone/blob/master/README.md#secrets))