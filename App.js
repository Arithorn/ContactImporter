import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import base64 from "base64-js";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Csv from "papaparse";
import XLSX from "xlsx";

// import { unzipWithPassword } from "react-native-zip-archive";

import { createContacts, getContacts, getPermission } from "./Contacts";
import PasswordInput from "./Components/PasswordInput";

const importCSV = async (password) => {
  console.log(password);
  console.log("Importing CSV");
  let status = await getPermission();
  let json;
  let fileName;
  if (status == "granted") {
    let document = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });
    if (document.type != "success") {
      console.log("No Document Selected");
    } else {
      try {
        if (document.name.endsWith(".zip")) {
          console.log(`Zip File : ${document.name}`);
          // let workdir = FileSystem.cacheDirectory;
          // fileName = unZipFile(document.uri, workdir, password);
          // return;
        }
        if (document.name.endsWith(".xlsx")) {
          console.log(`Excel File : ${document.name}`);
          let data = await readXLSX(document.uri);
          console.log(data);
        }
        let data = await FileSystem.readAsStringAsync(`file://${document.uri}`);
        json = Csv.parse(data, { header: true });
        console.log("JSON Data");
        console.log(json.data);
        createContacts(json.data);
        Alert.alert("Contacts Created");
      } catch (e) {
        console.log(e);
        Alert.alert("File Load Failed");
      }
    }
  }
};

// const unZipFile = async (uri, workdir, password) => {
//   console.log(`URI: ${uri} PASS: ${password} WD: ${workdir}`);

//   unzipWithPassword(uri, `${workdir}`, password)
//     .then((path) => console.log(path))
//     .catch((error) => console.error(error));

//   //console.log(`Unzip Result : ${result}`);

//   return "Test";
// };
function stringToUint8Array(str) {
  const length = str.length;
  const array = new Uint8Array(new ArrayBuffer(length));
  for (let i = 0; i < length; i++) array[i] = str.charCodeAt(i);
  return array;
}
const readXLSX = async (fname) => {
  let content = await FileSystem.readAsStringAsync(`file://${fname}`);
  let data = base64.fromByteArray(stringToUint8Array(content));
  let workbook = XLSX.read(data, { type: "string" });
  console.log(workbook.SheetNames);
  console.log(workbook.Sheets[workbook.SheetNames[0]]);
  let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
  console.log(first_worksheet);
  let json = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
  // console.log(json);
  return json;
};

export default function App() {
  const [password, setPassword] = useState();
  return (
    <View style={styles.container}>
      <Text>Import Contact Details from a CSV File</Text>
      <PasswordInput onChange={(password) => setPassword(password)} />
      <Button onPress={() => importCSV(password)} title="Import"></Button>
      {/* <Button onPress={getContacts} title="Contacts"></Button> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#20babd",
    alignItems: "center",
    justifyContent: "center",
  },
});
