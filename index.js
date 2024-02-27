//class representing the information of a contact
class Person {
  constructor(name, birthday, relation, phoneNumber) {
    this.name = name;
    this.birthday = birthday;
    this.relation = relation;
    this.phoneNumber = phoneNumber;
  }
}

//class that handles requests involving contacts
class ContactManager {
  static URL = "http://localhost:5000/contacts";
  constructor() {}
  //makes a get request for alll the contacts
  static async getContacts() {
    const response = await fetch(this.URL);
    const data = await response.json();
    return data;
  }

  //makes a post request to add a new contact to the db
  static async postContact(newPerson) {
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(newPerson),
      headers: {
        "Content-Type": "application/json",
      },
    };
    await fetch(this.URL, fetchOptions);
  }
  //takes an id and deletes the contact with a matching id from db
  static async deleteContact(id) {
    const fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    await fetch(`${this.URL}/${id}`, fetchOptions);
  }

  //makes a put request to replace the contact with the specified id with the provided contact
  static async putContact(contactID, editObject) {
    const fetchOptions = {
      method: "PUT",
      body: JSON.stringify(editObject),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(`${this.URL}/${contactID}`, fetchOptions);
  }

  //function that populates the contact container wtih contacts from the db
  static async renderContacts() {
    $("contact-container").empty();
    let contacts = await ContactManager.getContacts();
    for (const contact of contacts) {
      $("#contact-container").append(`
        <div id="contact-${contact.id}" class="card mb-3" style="width: 13rem">
            <div class="card-body">
                <h5 class="card-title">${contact.name}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">ID: ${contact.id}</h6>
                <p class="mb-0">${contact.relation} : ${contact.birthday}</p>
                <p class="mb-0" >Phone #: ${contact.phoneNumber}</p>
                <button id="deleteContact-${contact.id}" class="btn btn-danger mt-2 form-control">Delete</button>
            </div>
        </div>
        `);
      $(`#deleteContact-${contact.id}`).on("click", (event) => {
        event.preventDefault();
        ContactManager.deleteContact(contact.id);
      });
    }
  }
}

// START OF PROGRAM
ContactManager.renderContacts();

// EVENT LISTENERS
$("#newContactForm").on("submit", (event) => {
  event.preventDefault();
  console.log(event);
  const newPerson = new Person(
    $("#fullName").val(),
    $("#birthday").val(),
    $("#relation").val(),
    $("#phoneNumber").val()
  );
  console.log(newPerson);
  ContactManager.postContact(newPerson);
  ContactManager.renderContacts();
});

$("#updateContactForm").on("submit", (event) => {
  event.preventDefault();
  console.log(event);
  const editPerson = new Person(
    $("#updateFullName").val(),
    $("#updateBirthday").val(),
    $("#updateRelation").val(),
    $("#updatePhoneNumber").val()
  );
  const contactID = $("#contactID").val();
  ContactManager.putContact(contactID, editPerson);
  ContactManager.renderContacts();
});
