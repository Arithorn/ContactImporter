import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import base64 from "base64-js";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Csv from "papaparse";

import { unzipWithPassword } from "react-native-zip-archive";

import { createContacts, getContacts, getPermission } from "./Contacts";
import PasswordInput from "./Components/PasswordInput";

const importCSV = async (password) => {
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
          if (password.length <= 1) {
            Alert.alert("Please Provide the Password");
            return;
          }
          let workdir = FileSystem.cacheDirectory;
          fileName = await unZipFile(document.uri, workdir, password);
        }
        if (document.name.endsWith(".csv")) {
          fileName = `file://${document.uri}`;
        }
        console.log(`fileName : ${fileName}`);
        let data = await FileSystem.readAsStringAsync(fileName);
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

const unZipFile = async (uri, workdir, password) => {
  console.log(`URI: ${uri} PASS: ${password} WD: ${workdir}`);
  let fname = "none";
  let path = await unzipWithPassword(uri, `${workdir}`, password);
  fname = path[0];
  let result = `${workdir}${fname}`;
  console.log(result);
  if (fname != "none") {
    return result;
  }
  return "none";
};

export default function App() {
  const [password, setPassword] = useState();
  return (
    <View style={styles.container}>
      <Text>Import Contact Details from a CSV File!</Text>
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
    backgroundColor: "#00babd",
    alignItems: "center",
    justifyContent: "center",
  },
});
