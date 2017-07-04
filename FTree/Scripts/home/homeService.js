; (function () {
    'use strict';
    angular.module("app").service("HomeService", ["$http", "$window", "$uibModal", "constants", homeService]);

    function homeService($http, $window, $uibModal, constants) {
        //***** DATA
        var _data = {};
        var _GetData = function (data) {
            _data = data || _data;
            _updateFamilyHierarchy()

            //TODO: load enumerations on page loading, i.e. in layout.cshtml
            _LoadEnumerations();

            //console.log(_data);                   //for debug only
            return _data;
        };

        var _getPerson = function (personId) {
            //find person in person-dictionary and return person data
            var result = _getEmptyPersons();
            Object.keys(_data.personList).forEach(function (key) {
                var person = _data.personList[key];
                if (person.Person.Id == personId) {
                    result = person;
                }
            });
            return result;
        };
        var _getEmptyPersons = function () {
            //return "No Record" for a person
            return {
                Person: {
                    Id: null,
                    Name: constants.NA,
                    Sex: null,
                    Age: null,
                    Family: constants.NA,
                    MaritalStatus: null,
                    Image: null,
                    Names: {
                        Name: [
                            {
                                Id: null,
                                Name: constants.NA,
                                Date: null,
                                IsCurrent: false,
                                First: "",
                                Last: "",
                                Middle: null,
                                Maiden: "",
                            }
                        ],
                        Aliases: {
                            Alias: { Id: null, Name: constants.NA, }
                        }
                    },
                    Parents: {
                        MotherId: null,
                        FatherId: null,
                        AdoptedMotherId: null,
                        AdoptedFatherId: null
                    },
                    SpecialDates: {
                        Born: { Date: null, LocationId: null },
                        Death: { Date: null, LocationId: null }
                    },
                    Spouses: [
                        {
                            id: null,
                            personId: null,
                            isCurrent: true
                        }
                    ],
                    Contacts: [],
                    Comments: [],
                    Locations: [],
                    Education: [],
                    Professions: [],
                    WorkHistory: [],
                    Events: [
                        {
                            id: null,
                            date: null,
                            place: null,
                            description: null,
                            attendees: null,
                            gallery: null
                        }
                    ],
                    Galleries: [
                        {
                            id: null,
                            name: null,
                            items: [
                                {
                                    id: null,
                                    image: null,
                                    description: null
                                }
                            ]
                        }
                    ]
                }
            };
        };
        var _getPersonName = function (personId, familySelected) {
            if (personId < 0) {
                return {
                    fullName: constants.NA,
                    maidenFullName: void 0,
                    baseFamily: void 0,
                    family: familySelected
                };
            }
            var person = _getPerson(personId);
            var currentName = person.Person.Names.Name;
            var fullName = currentName.length > 1
                ? (currentName[0].First === undefined ? "" : currentName[0].First) + " " + (currentName[0].Last === undefined ? "" : currentName[0].Last)
                : (currentName.First === undefined ? "" : currentName.First) + " " + (currentName.Last === undefined ? "" : currentName.Last);
            if (fullName.length < 2) fullName = constants.NA;
            var maidenFullName = (person.Person.Sex === "М") ? fullName : (currentName.First === undefined ? "" : currentName.First) + " " + (currentName.Maiden === undefined ? "" : currentName.Maiden);
            var familyPerson = person.Person.Family;
            var currentPartner = null;
            if (person.Person.Spouses) {
                Object.keys(person.Person.Spouses).forEach(function (key) {
                    if (key.isActive) {
                        currentPartner = _getPerson(key.personId);
                    }
                });
            }
            var family = (person.Person.Sex === "М") ? familyPerson : (currentPartner == null ? familyPerson : currentPartner.Person.Family);
            return {
                fullName: fullName,
                maidenFullName: maidenFullName,
                baseFamily: familySelected ? familySelected : familyPerson,
                family: family
            };
        };

        var _isCss = function (personId, familly, conditionName) {
            var result = false;
            if (conditionName === constants.flag_isSameFamily) {
                var person = _getPerson(personId);
                result = familly === person.Person.Family;
            }
            return result;
        };

        //***** AJAX
        var _updateFamilyHierarchy = function () {
            //TODO: 
            //1. re-generate family hierarchy and assign to _data and return it to the UI
            //2. update log file

            //api/GetData
            //$http.post("/Home/GetData/", {
            $http.post(constants.url_GetData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .then(function (result) {
                //1. load person-dictionary data
                _data.personList = angular.fromJson(result.data.PersonData);
                //2. crate family list
                _data.familyList = angular.fromJson(result.data.Family);
                //3. set flag to hide "loading..." 
                _data.loaded = true;
                _data.searchValue = "";
            })
            .catch(function (result) {
                _alert("ERROR during data load!\n" + result);
            });
        }

        //***** TREE    *****
        var _ExpandOrCollapse = function (node, isOpen) {
            if (node == null) return false;
            for (var i in node) {
                var n = node[i];
                _ExpandOrCollapse(n.Nodes, isOpen);
                n.isOpen = isOpen;
            }
        }

        var _Search = function (scope) {
            var currentData = scope.instance.data;
            currentData.hasMatch = true;
            if ((currentData.searchValue === undefined) || (currentData.searchValue.length === 0)) {
                _ShowAll(currentData.familyList);
                return;
            }

            //get person id list
            var personIds = _getMatchedPersonIds(currentData);
            if (personIds.length < 1) {
                currentData.hasMatch = false;
                return;
            }

            //hide unselected nodes
            _ShowSelected(currentData.familyList, personIds);
        }

        var _getMatchedPersonIds = function (data) {
            var result = [];
            var searchVal = data.searchValue;
            angular.forEach(data.personList, function (person) {
                var personId = person.Person.Id;
                if (Array.isArray(person.Person.Names.Name)) {
                    angular.forEach(person.Person.Names.Name, function (name) {
                        if (_IsMatchedName(name, searchVal) && !_IsInArray(result, personId)) result.push(personId);
                    });
                }
                else {
                    if (_IsMatchedName(person.Person.Names.Name, searchVal)) result.push(personId);
                }
            });
            return result;
        }
        var _IsMatchedName = function (name, searchVal) {
            var result = _StartsWith(name.First, searchVal) || _StartsWith(name.Last, searchVal);
            return result;
        }

        var _ShowAll = function (nodes) {
            //TODO: show all elements in family hierarchy
            if (nodes == null) return;
            angular.forEach(nodes, function (node) {
                _ShowAll(node.Nodes);
                node.isHidden = false;
                node.isOpen = false;
            });
        }
        var _ShowSelected = function (nodes, ids) { //nodes is family hierarchy
            if (nodes == null) return false;
            var result = false;

            angular.forEach(nodes, function (node) {
                if (_IsFamilyRoot(node)) result = false;
                var parent = result;
                result = _ShowSelected(node.Nodes, ids);
                node.isHidden = true;
                if (result) {   //show and open all parents
                    node.isOpen = result;
                    node.isHidden = !result;
                }
                else {
                    if (_IsIdIn(node.Id, ids) || _IsIdIn(node.Spouseid, ids)) {
                        node.isOpen = true;
                        node.isHidden = false;
                        result = true;
                    }
                    else {
                        result = parent;
                    }
                }

            });
            return result;
        }
        var _IsFamilyRoot = function (node) {
            var result = (node.Name != undefined) && (node.Name.length > 3);
            return result;
        }

        //***** PERSON  *****
        //show person information on right panel
        var _ShowPerson = function (node) {
            //load person data
            var person = _getPerson(node.id);
            //result = family === person.Person.Names.Name.Last;
            if (node.family !== person.Person.Family) person = _getPerson(node.spouseId);
            if (node.family !== person.Person.Family) {
                _alert("Excpetion: can't have emtpy node in the tree!");
            }

            if (node.selectedPerson && (person.Person.Id === node.selectedPerson.Id)) {
                //skip it (close the node)
                return;
            }
            _data.selectedPerson = _ToSelectedPerson(person.Person);
        }

        var _AddPerson = function () {
            var person = _getEmptyPersons();
            _EditPerson(_ToSelectedPerson(person));
        }
        var _EditPerson = function (person) {
            //TODO: edit person
            var modalInstance = $uibModal.open({
                animation: false,
                component: "ModalDialogComponent",
                resolve: {
                    person: function () { return person; }
                    , mode: function () { return constants.mode_edit; /*(mode === undefined ? "Show" : mode);  "Edit"*/ }
                },
                size: "lg"
            });
            modalInstance.result.then(
                function (result) {                 //update
                    var person = result;
                    _UpdatePerson(person);
                }
                , function (result) {               //cancel
                    _alert("Cancel " + new Date() + "\n" + result);
                    console.log("Cancel " + new Date());
                }
            );
        }
        //TODO: add/udpate xml data with person information
        var _UpdatePerson = function (person) {
            _alert(person.Name + "\n" + person.Age);
        }






        var _ShowFamilyTree = function (person) {
            //TODO: generate family tree
        }

        var _ToSelectedPerson = function (person) {
            //calc person age
            var dateBorn = _ToDate(person.SpecialDates.Born.Date);
            var datePA = _ToDate(person.SpecialDates.Death.Date);
            var age = _DateDiff(dateBorn, datePA);

            //TODO: calc marital status
            var isMarried;

            return {
                //personal data
                Id: person.Id,
                Family: person.Family,
                Name: person.Name,
                Sex: person.Sex === constants.name_sex_male_abrev ? constants.name_sex_male : constants.name_sex_female,
                Age: age,
                IsMarried: isMarried,
                Image: person.Image,
                SpecialDates: {
                    Born: { Date: dateBorn === constants.NA ? dateBorn : dateBorn.toLocaleDateString(), Location: _GetLocation(person.SpecialDates.Born.LocationId) },
                    PassAway: { Date: datePA === constants.NA ? datePA : datePA.toLocaleDateString(), Location: _GetLocation(person.SpecialDates.Death.LocationId) }
                },
                NamesAndAliases: _GetNamesAndAliases(person),
                //relationships
                Parents: _GetParents(person),
                Spouses: _GetSpouses(person),
                Children: _GetChildren(person),
                //contacts, comments and addresses
                Contacts: _GetContacts(person),
                Addresses: _GetAddresses(person),
                Comments: _GetComments(person.Comments),
                //education
                Education: _GetEducation(person),
                //professions
                Professions: _GetProfessions(person),
                //work history
                WorkHistory: _GetWorkHistory(person),
                //events
                Events: _GetEvents(person),

                //TODO: galleries
                Galleries: [],

                //constants
                Constants: constants
            };
        }

        var _GetNamesAndAliases = function (person) {
            //build names and aliases
            var names = [];
            var aliases = [];

            if (Array.isArray(person.Names.Name)) {
                angular.forEach(person.Names.Name, function (item) {
                    var name = {};
                    name.Id = item.Id;
                    name.Name = item.Name;
                    name.IsCurrent = item.IsCurrent;
                    name.Date = _ToDate(item.Date);
                    name.Date = name.Date === constants.NA ? name.Date : name.Date.toLocaleDateString();
                    names.push(name);
                });
            }
            else {
                names.push({
                    Id: person.Names.Name.Id,
                    Name: person.Names.Name.Name,
                    IsCurrent: person.Names.Name.IsCurrent,
                    Date: _ToDate(person.Names.Name.Date) === constants.NA ? constants.NA : _ToDate(person.Names.Name.Date).toLocaleDateString()
                });
            }


            //TODO: check aliases xml and json definition because it looks json is created by wrong way: Aliases:{ Alias: {} } => right way: Aliases:[ Alias: {} ]
            angular.forEach(person.Names.Aliases, function (item) {
                aliases.push({ Id: item.Id, Name: item.Name });
            });

            return {
                Names: names,
                Aliases: aliases
            };
        }

        var _GetParents = function (person) {
            //get parent names and family
            var father = _getPersonName(person.Parents.FatherId, person.Family);
            var aFather = _getPersonName(person.Parents.AdoptedFatherId, person.Family);
            var mother = _getPersonName(person.Parents.MotherId, person.Family);
            var aMother = _getPersonName(person.Parents.AdoptedMotherId, person.Family);
            var empty = { Name: constants.NA, Family: constants.NA };

            return {
                IsAdopted: aFather.fullName !== constants.NA || aMother.fullName !== constants.NA,
                Mother: mother.fullName === constants.NA ? empty : { Name: mother.fullName, Family: mother.family },
                Father: father.fullName === constants.NA ? empty : { Name: father.fullName, Family: father.family },
                AMother: aMother.fullName === constants.NA ? empty : { Name: aMother.fullName, Family: aMother.family },
                AFather: aFather.fullName === constants.NA ? empty : { Name: aFather.fullName, Family: aFather.family }
            }
        }

        var _GetSpouses = function (person) {
            //get spouse list
            var result = [];
            if (Array.isArray(person.Spouses.Spouse)) {
                angular.forEach(person.Spouses.Spouse, function (item) {
                    result.push(_CreateSpouse(item));
                });
            } else {
                result.push(_CreateSpouse(person.Spouses.Spouse));
            }
            return result;
        }
        var _CreateSpouse = function (input) {
            var result = {};
            var pereson = _getPersonName(input.PersonId);
            result.Id = input.Id;
            result.Name = pereson.fullName;
            result.Family = pereson.family;
            result.IsCurrent = input.IsCurrent;
            return result;
        }

        var _GetChildren = function (parent) {
            var result = [];
            Object.keys(_data.personList).forEach(function (key) {
                var person = _data.personList[key].Person;
                if ((person.Parents.MotherId == parent.Id) || (person.Parents.FatherId == parent.Id) || (person.Parents.AdoptedMotherId == parent.Id) || (person.Parents.AdoptedFatherId == parent.Id)) {
                    var parents = _GetParents(person);
                    result.push({
                        ChildId: person.Id,
                        Name: person.Name,
                        Family: person.Family,
                        Parents: parents
                    });
                }
            });
            return result;
        }

        var _GetContacts = function (person) {
            var result = [];
            if (person.Contacts == undefined) return result;
            if (person.Contacts.length < 1) return result;

            if (angular.isArray(person.Contacts.Contact)) {
                for (var i = 0, len = person.Contacts.Contact.length; i < len; i++) {
                    var contact = person.Contacts.Contact[i];
                    result.push({ Name: _GetContactType(contact.Name), Text: contact.Text });
                }
            } else {
                var contact = person.Contacts.Contact;
                result.push({ Name: _GetContactType(contact.Name), Text: contact.Text });
            }
            return result;
        }

        var _GetAddresses = function (person) {
            var result = [];

            if (person.Locations == undefined) return result;
            if (person.Locations.length < 1) return result;

            if (angular.isArray(person.Locations.Location)) {
                for (var i = 0, len = person.Locations.Location.length; i < len; i++) {
                    var location = person.Locations.Location[i];
                    result.push({ Name: location.Name, Address: _GetLocation(location.LocationId), DateFrom: _DateFormat(location.DateFrom, "toLocaleDate"), IsOwn: location.IsOwn == "true" ? "Yes" : "No" });
                }
            } else {
                var location = person.Locations.Location;
                result.push({ Name: location.Name, Address: _GetLocation(location.LocationId), DateFrom: _DateFormat(location.DateFrom, "toLocaleDate"), IsOwn: location.IsOwn == "true" ? "Yes" : "No" });
            }
            return result;
        }

        var _GetComments = function (comments) {
            var result = [];
            if (comments == undefined) return result;
            if (comments.length < 1) return result;

            if (angular.isArray(comments.Comment)) {
                for (var i = 0, len = comments.Comment.length; i < len; i++) {
                    var comment = comments.Comment[i];
                    result.push({ Name: comment.Name, Text: comment.Text });
                }
            }
            else {
                result.push({ Name: comments.Comment.Name, Text: comments.Comment.Text });
            }
            return result;
        }

        var _GetEducation = function (person) {
            var result = [];
            if (person.Education == undefined) return result;
            if (person.Education.length < 1) return result;

            if (angular.isArray(person.Education.School)) {
                for (var i = 0, len = person.Education.School.length; i < len; i++) {
                    var edu = person.Education.School[i];
                    result.push({ Name: edu.Name, DateStart: _DateFormat(edu.DateStart, "toLocaleDate"), DateEnd: _DateFormat(edu.DateEnd, "toLocaleDate"), Degree: _GetDegree(edu.DegreeId), Address: _GetLocation(edu.LocationId), Comments: _GetComments(edu.Comments) });
                }
            }
            else {
                var edu = person.Education.School;
                result.push({ Name: edu.Name, DateStart: _DateFormat(edu.DateStart, "toLocaleDate"), DateEnd: _DateFormat(edu.DateEnd, "toLocaleDate"), Degree: _GetDegree(edu.DegreeId), Address: _GetLocation(edu.LocationId), Comments: _GetComments(edu.Comments) });
            }
            return result;
        }

        var _GetProfessions = function (person) {
            var result = [];
            if (person.Professions == undefined) return result;
            if (person.Professions.length < 1) return result;

            if (angular.isArray(person.Professions.Profession)) {
                for (var i = 0, len = person.Professions.Profession.length; i < len; i++) {
                    var profession = person.Professions.Profession[i];
                    result.push({ Name: profession.Name, IsCurrent: _ToYesNo(profession.IsCurrent), Comments: _GetComments(profession.Comments) });
                }
            } else {
                var profession = person.Professions.Profession;
                result.push({ Name: profession.Name, IsCurrent: _ToYesNo(profession.IsCurrent), Comments: _GetComments(profession.Comments) });
            }
            return result;
        }

        var _GetWorkHistory = function (person) {
            var result = [];
            if (person.WorkHistory == undefined) return result;
            if (person.WorkHistory.length < 1) return result;

            if (angular.isArray(person.WorkHistory.Item)) {
                for (var i = 0, len = person.WorkHistory.Item.length; i < len; i++) {
                    var work = person.WorkHistory.Item[i];
                    result.push({ Name: work.Name, DateStart: _DateFormat(work.DateStart, "toLocaleDate"), DateEnd: _DateFormat(work.DateEnd, "toLocaleDate"), TotalYears: work.TotalYears.length < 1 ? _DateDiff(work.dateStart, work.DateEnd) : work.TotalYears, Occupation: work.Occupation, Comments: _GetComments(work.Comments) });
                }
            }
            else {
                var work = person.WorkHistory.Item;
                result.push({ Name: work.Name, DateStart: _DateFormat(work.DateStart, "toLocaleDate"), DateEnd: _DateFormat(work.DateEnd, "toLocaleDate"), TotalYears: work.TotalYears.length < 1 ? _DateDiff(work.dateStart, work.DateEnd) : work.TotalYears, Occupation: work.Occupation, Comments: _GetComments(work.Comments) });
            }
            return result;
        }

        var _GetEvents = function (person) {
            var result = [];
            if (person.Events == undefined) return result;
            if (person.Events.length < 1) return result;

            if (angular.isArray(person.Events.Event)) {
                for (var i = 0, len = person.Events.Event.length; i < len; i++) {
                    var event = person.Events.Event[i];
                    result.push({ Name: event.Name, Date: _DateFormat(event.Date, "toLocaleDate"), Descriptipon: event.Description, Address: _GetLocation(event.LocationId), Attendees: _GetEventAttendees(event.Attendees), Comments: _GetComments(event.Comments) });
                }
            }
            else {
                var event = person.Events.Event;
                result.push({ Name: event.Name, Date: _DateFormat(event.Date, "toLocaleDate"), Descriptipon: event.Description, Address: _GetLocation(event.LocationId), Attendees: _GetEventAttendees(event.Attendees), Comments: _GetComments(event.Comments) });
            }
            return result;
        }
        var _GetEventAttendees = function (attendeeList) {
            if (attendeeList == undefined) return constants.NA;
            if (attendeeList.length < 1) return constants.NA;

            var result = [];
            for (var i = 0, len = attendeeList.length; i < len; i++) {
                result.push({ "Name": _getPersonName(attendeeList[i]) });
            }
            return result;
        }


        //***** HELPERS *****
        var _IsIdIn = function (id, ids) {
            for (var i in ids) {
                if (ids[i] == id) return true;
            }
            return false;
        }
        var _IsInArray = function (arr, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === value) return true;
            }
            return false;
        }

        var _StartsWith = function (input, value) {
            if (input === undefined) return false;
            return input.indexOf(value) === 0;
        }

        var _ToYesNo = function (value) {
            return value === "true" ? "Yes" : "No";
        }
        var _ToDate = function (date) {
            if ((date === undefined) || (date.length === 0) || (date == -1)) return constants.NA;
            //NOTE:assume that paramter is valid date in folowing format: yyyymmdd
            return new Date(date.substring(0, 4), parseInt(date.substring(4, 6)) - 1, date.substring(6, 8));
        }
        //TODO: refactor it
        var _DateDiff = function (dateStart, dateEnd) {
            if ((dateStart == undefined) || (dateStart.length < 2) || (dateStart === constants.NA)) return constants.NA;
            if ((dateEnd === undefined) || (dateEnd === constants.NA)) dateEnd = new Date();

            //https://www.codeproject.com/Questions/228987/Calculate-Age-from-Date-of-birth-using-Javscript-o
            if ((dateStart.getMonth() === dateEnd.getMonth()) && (dateStart.getDate() === dateEnd.getDate())) return dateEnd.getFullYear() - dateStart.getFullYear();

            var result = Math.floor((dateEnd.getTime() - dateStart.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            return result;
        }
        //TODO: refactor it
        var _DateFormat = function (input, format) {
            if ((input == undefined) || (input === "") || (input === "NA")) return "NA";

            //full date
            if (input.length === 8) {
                var date = _ToDate(input);
                if ((format == undefined) || (format === "")) return date;
                if (format === "toLocaleDate") return date.toLocaleDateString();
                return date;
            }
            else {
                if (input.length === 4) return input;     //year only
                if (input.length === 6) return _DateFormat(input + "01", format);
            }
            return "NA";
        }

        var _GetLocation = function (id) {
            return _GetEnumValue(id, $window.enumLocation, true);
        }
        var _GetContactType = function (id) {
            return _GetEnumValue(id, $window.enumContactTypes);
        }
        var _GetDegree = function (id) {
            return _GetEnumValue(id, $window.enumDegreeType);
        }
        var _GetEnumValue = function (id, enumeration, isEnumLocation) {
            for (var i = 0, len = enumeration.length; i < len; i++) {
                var result = enumeration[i];
                if (result.Id == id) return isEnumLocation ? result.Address : result.Name;
            }
            return constants.NA;
        }

        var _GetConstants = function () {
            return constants;
        }

        var _alert = function (msg) {
            $window.alert(msg);
            //alert(msg)
        };


        //TEST ONLY
        var _LoadEnumerations = function () {
            $window.enumLocation = $window.enumLocation || _LoadEnumLocation();
            $window.enumEventType = [];
            $window.enumDegreeType = $window.enumDegreeType || _LoadEnumDegree();
            $window.enumContactTypes = $window.enumContactTypes || _LoadEnumContact();
        }
        var _LoadEnumDegree = function () {
            var result = [];
            result.push({ Id: "1", Name: "High school" });
            result.push({ Id: "2", Name: "BSc" });
            result.push({ Id: "3", Name: "MSc" });
            result.push({ Id: "4", Name: "PhD" });
            return result;
        }
        var _LoadEnumContact = function () {
            var result = [];
            result.push({ Id: "1", Name: "Home Phone" });
            result.push({ Id: "2", Name: "Mobile Phone (Personal)" });
            result.push({ Id: "3", Name: "Mobile Phone (Business)" });
            result.push({ Id: "4", Name: "E-mail (Personal)" });
            result.push({ Id: "5", Name: "Email (Business)" });
            return result;
        }
        var _LoadEnumLocation = function () {
            var result = [];
            result.push({ Id: 1, Name: "Дяково", Address: "Дяково" });
            result.push({ Id: 2, Name: "Блатино", Address: "Блатино" });
            result.push({ Id: 3, Name: "Мламолово", Address: "Мламолово" });
            result.push({ Id: 4, Name: "Кукая", Address: "Кукая, Дяково" });
            result.push({ Id: 5, Name: "Яхиново", Address: "Яхиново" });
            result.push({ Id: 6, Name: "Алино", Address: "Алино" });
            result.push({ Id: 7, Name: "София", Address: "София" });
            result.push({ Id: 8, Name: "Радомир", Address: "Радомир" });
            result.push({ Id: 9, Name: "Червен брег", Address: "Червен брег" });
            result.push({ Id: 10, Name: "Пловдив", Address: "Пловдив" });
            result.push({ Id: 11, Name: "Дупница", Address: "Дупница" });
            result.push({ Id: 12, Name: "Сев. България", Address: "Сев. България" });
            result.push({ Id: 13, Name: "Русе", Address: "Русе" });
            result.push({ Id: 14, Name: "Долистово", Address: "Долистово" });
            result.push({ Id: 15, Name: "Бучалата", Address: "Бучалата, Дяково" });
            result.push({ Id: 16, Name: "Пиперево", Address: "Пиперево" });
            result.push({ Id: 17, Name: "Pernik", Address: "Pernik" });
            result.push({ Id: 18, Name: "NY", Address: "NY, USA" });
            result.push({ Id: 19, Name: "Dobrich", Address: "Dobrich" });
            result.push({ Id: 20, Name: "Samokov", Address: "Samokov" });
            result.push({ Id: 21, Name: "Крайници", Address: "Крайници" });
            result.push({ Id: 22, Name: "Костенец", Address: "Костенец" });
            return result;
        }
        //END: TEST ONLY


        return {
            events: {
                alert: _alert       //TODO: remove it

                , getPersonName: _getPersonName
                , getPerson: _getPerson
                , isCss: _isCss

                , expandOrCollapse: _ExpandOrCollapse
                , search: _Search

                , showPerson: _ShowPerson
                , addPerson: _AddPerson
                , editPerson: _EditPerson
                , showFamilyTree: _ShowFamilyTree

                , getConstants: _GetConstants
            },
            getData: _GetData
            , updateFamilyHierarchy: _updateFamilyHierarchy
        };
    }
})()