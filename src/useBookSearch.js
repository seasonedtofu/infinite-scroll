import { useEffect, useState } from 'react';
import axios from 'axios'

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [books, setBooks] = useState([]) //store books
  const [hasMore, setHasMore] = useState(false) //more results

  useEffect(() => {
    setBooks([])
  }, [query])
  
  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
        method: 'GET',
        url: 'http://openlibrary.org/search.json',
        params: { q: query, page: pageNumber },
        cancelToken: new axios.CancelToken(c => cancel = c) //cancel each search character until done typing
    }).then(res => {
        setBooks(prevBooks => { //adding more books
            return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])] //only title of book
        })
        setHasMore(res.data.docs.length > 0) //no more data
        setLoading(false) //no longer have to load data
        console.log(res.data)
    }).catch(e => {
        if (axios.isCancel(e)) return //ignore all cancel msgs bcuz we actually wanted to ignore
        setError(true) //actually found error
    })
    return () => cancel()
  },[query, pageNumber])  
  return { loading, error, books, hasMore }
}
