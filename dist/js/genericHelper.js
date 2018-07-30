function convertToDurationTimeString(fullDateString) {
    moment.locale("vi");
    return moment(fullDateString).fromNow();
}