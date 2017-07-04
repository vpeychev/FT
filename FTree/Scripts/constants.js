; (function () {
    'use strict';
    angular.module("app").constant("constants", {
        NA: "NA"

        , flag_isSameFamily: "isSameFamily"

        , label_person_select: "Select a person from family tree"

        , mode_edit: "Edit"
        , mode_show: "Show"

        , name_isCurrent: "Is Current"
        , name_name: "Name"


        , name_button_add_person: "Add Person"
        , name_button_edit_person: "Edit data for"
        , name_button_add: "Add"
        , name_button_edit: "Edit"
        , name_button_cancel: "Cancel"
        , name_button_close: "Close"
        , name_button_save: "Save"
        , name_button_showFT: "Show Family tree"

        , name_header_addresses: "Addresses"
        , name_header_aliases: "Aliases"
        , name_header_children: "Children"
        , name_header_contacts: "Contacts"
        , name_header_family: "Family"
        , name_header_info_person: "Information about"
        , name_header_names: "Names"
        , name_header_parents: "Parents"
        , name_header_spouse: "Spouse"
        

        , name_header_person_common: "Personal data"
        , name_header_person_contacts: "Addresses, Contacts and Comments"
        , name_header_person_eduction: "Eduction"
        , name_header_person_events: "Events"
        , name_header_person_galleries: "Galleries"
        , name_header_person_professions: "Professions"
        , name_header_person_relationships: "Relationships"
        , name_header_person_workHistory: "Work History"


        , name_parent_afather: "Adopted Father"
        , name_parent_amother: "Adopted Mother"
        , name_parent_father: "Father"
        , name_parent_mother: "Mother"
        , name_sex: "Sex"
        , name_sex_female: "Female"
        , name_sex_female_abrev: "Ж"
        , name_sex_male: "Male"
        , name_sex_male_abrev: "М"

        , url_GetData: "/api/GetData/"
    });
})()