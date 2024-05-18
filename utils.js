



export  const mapFirebaseResults = (querySnapshot) => {
    const results = [ ]
    querySnapshot.forEach(docSnapshot => results.push(docSnapshot.val()))
    return results
}

export  const mapFirebaseResultsDict = (querySnapshot) => {
    return querySnapshot.val()
}