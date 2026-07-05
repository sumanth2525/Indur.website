import { useState, useEffect } from 'react'
import { resolveBrowseLocation } from '../services/formatters'
import { patchProfile } from '../services/dataApi'

export default function useBrowseLocation(user, setUser) {
  const [location, setLocation] = useState(() => resolveBrowseLocation(user))

  useEffect(() => {
    setLocation(resolveBrowseLocation(user))
  }, [user?.browseLocation, user?.location])

  const handleLocationChange = async (loc) => {
    setLocation(loc)
    if (!user?.id) return
    const updated = await patchProfile(user.id, {
      browseLocation: loc,
      location: loc.label,
    })
    if (updated) setUser(updated)
  }

  return { location, setLocation, handleLocationChange }
}
