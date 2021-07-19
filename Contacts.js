import * as Contacts from "expo-contacts";

const createContact = async (user) => {
  //   const { fname, lname, mnumber } = user;
  let fname = user["Legal First Name"];
  let lname = user["Legal Surname"];
  let department = user["Department"];
  let level = user["Job Level"];
  let mnumber = user["Phone Number"];
  let phoneNumber = [{ label: "mobile", number: mnumber, type: "2" }];
  const contact = {
    [Contacts.Fields.FirstName]: fname,
    [Contacts.Fields.LastName]: lname,
    [Contacts.Fields.Company]: "Discovery",
    [Contacts.Fields.PhoneNumbers]: phoneNumber,
    [Contacts.Fields.Department]: department,
    [Contacts.Fields.JobTitle]: level,
  };
  console.log(contact);
  //   Contacts.addContactAsync(contact);
};

export const createContacts = async (userList) => {
  userList.reduce(async (next, user) => {
    await next;
    createContact(user);
  });
};

export const getPermission = async () => {
  const { status } = await Contacts.requestPermissionsAsync();
  return status;
};

export const getContacts = async () => {
  let contacts = await Contacts.getContactsAsync();
  console.log(contacts);
};
