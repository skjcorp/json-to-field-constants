// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "json-to-field-constants" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let getFields = vscode.commands.registerCommand('json-to-field-constants.json-to-field-constants',() => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
		  return;
		}
		const selection = editor.selection;
		const text = editor.document.getText(selection);
		const jsonObject = JSON.parse(text);
		const newText = createNewText(jsonObject);
		addTextToClipboard(newText);
		vscode.window.showInformationMessage('Converted successfully,Paste Output to desired file');
	});

	context.subscriptions.push(getFields);
}


const getTypeOfElement = (element: any) => {
	return typeof element;
  };
  
  const getFormattingForType = (element: any): any => {
	const type = getTypeOfElement(element);
	if (type === "string") {
	  return `"${element}"`;
	}
	return element;
  };
  
  const getPropertiesFromObjectArray = (object: any) => {
	return Object.keys(object).map((property) =>
	  makeObject(object[property as any])
	);
  };
  
  const getArrayToString = (array: string[]) => {
	return `[${array.join(", ")}]`;
  };
  
  const replaceString = (string: string) => {
	return `"${string.replace(/\n/g, "\\n").replace(/\"/g, '\\"')}"`;
  };
  
  const createStringOfObject = (object: any) => {
	return Object.keys(object).map(
	  (property) => ` ${property}: ${makeObject(object[property])}`
	);
  };
  
  const getObjectToString = (stringArray: string[]) => {
	return `{${stringArray.join(", ")}}`;
  };
  
  const makeObject = (object: any): string => {
	switch (typeof object) {
	  case "undefined":
		return "undefined";
	  case "string":
		return replaceString(object);
	  case "object":
		if (!object) {
		  return "null";
		}
		if (object instanceof Array) {
		  const array = getPropertiesFromObjectArray(object);
		  return getArrayToString(array);
		}
		const objectString = createStringOfObject(object);
		return getObjectToString(objectString);
	  default:
		return object.toString();
	}
  };
  
  const createNewText = (jsonObject: any) => {
	const keys = Object.keys(jsonObject);
  
	return keys.map((key) => {
	  const type = getTypeOfElement(jsonObject[key]);
	  const ukey = key.toUpperCase();
  
	  if (!["string", "number", "boolean", "null"].includes(type.toString())) {
		// return `const ${key} = ${makeObject(jsonObject[key])};\n`;
		
		return `static const ${ukey} = ${makeObject(key)};\n`;
	  }
	  return `static const ${ukey} = ${getFormattingForType(
		// jsonObject[key]
		key
	  )};\n`;
	});
  };
  
  const addTextToClipboard = (text: string[]) => {
	vscode.env.clipboard.writeText(text.join(""));
  };
  
  export function deactivate() {}
  
