module.exports =  (obj1, obj2)=> {
    if (obj1['email 3'] && !obj2['email 3']) {
        return -1;
    } else if (!obj1['email 3'] && obj2['email 3']) {
        return 1;
    } else if (obj1['email 2'] && !obj2['email 2']) {
        return -1;
    } else if (!obj1['email 2'] && obj2['email 2']) {
        return 1;
    } else if (obj1['email 1'] && !obj2['email 1']) {
        return -1;
    } else if (!obj1['email 1'] && obj2['email 1']) {
        return 1;
    } else {
        return 0; // Objects have the same email structure or all email properties are empty, maintain order
    }
}