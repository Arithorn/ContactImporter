import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import * as Contacts from "expo-contacts";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Csv from "papaparse";

const createContact = async (user) => {
  const { fname, lname, mnumber } = user;
  let phoneNumber = [{ label: "mobile", number: mnumber, type: "2" }];
  const contact = {
    [Contacts.Fields.FirstName]: fname,
    [Contacts.Fields.LastName]: lname,
    [Contacts.Fields.Company]: "Discovery",
    [Contacts.Fields.PhoneNumbers]: phoneNumber,
  };
  // console.log(contact);
  Contacts.addContactAsync(contact);
  // console.log(`${fname} -> ${mnumber}`);
};

const createContacts = async (userList) => {
  userList.reduce(async (next, user) => {
    await next;
    createContact(user);
  });
};

const getPermission = async () => {
  const { status } = await Contacts.requestPermissionsAsync();
  // const {status2} = await StorageAccessFramework.requestDirectoryPermissionsAsync();
  return status;
};

const getContacts = async () => {
  let contacts = await Contacts.getContactsAsync();
  console.log(contacts);
};

const importCSV = async () => {
  console.log("Importing CSV");
  let status = await getPermission();
  let json;
  if (status == "granted") {
    let document = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });
    if (document.type != "success") {
      console.log("No Document Selected");
    } else {
      try {
        console.log(FileSystem.documentDirectory);
        let data = await FileSystem.readAsStringAsync(`file://${document.uri}`);
        // console.log(data);
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

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Import Contact Details from a CSV File</Text>
      <Button onPress={importCSV} title="Import"></Button>
      <Button onPress={getContacts} title="Contacts"></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
