import { useState, useCallback } from 'react'
import { Plus, Search, User, Check, Loader2 } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { friendService } from '../../services/friend.service'
import { User as UserType } from '../../types/user.types'

// Simple debounce implementation if lodash is not available
function useDebounce(func: any, wait: number) {
    // Basic implementation for React
    const debounce = (fn: Function, ms: number) => {
        let timeoutId: ReturnType<typeof setTimeout>
        return function (this: any, ...args: any[]) {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => fn.apply(this, args), ms)
        }
    }
    return useCallback(debounce(func, wait), [])
}

interface SearchFriendProps {
    onFriendAdded: () => void
}

export default function SearchFriend({ onFriendAdded }: SearchFriendProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<UserType[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim() || searchQuery.length < 2) {
            setResults([])
            return
        }

        setIsSearching(true)
        setError(null)
        try {
            const users = await friendService.searchUsers(searchQuery)
            setResults(users)
        } catch (err) {
            console.error('Search failed:', err)
            setError('Failed to search users')
        } finally {
            setIsSearching(false)
        }
    }

    // Debounce search to avoid too many API calls
    const debouncedSearch = useDebounce(handleSearch, 500)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value)
        debouncedSearch(value)
    }

    const sendRequest = async (user: UserType) => {
        try {
            await friendService.sendRequest(user.email) // The API expects email
            setSentRequests(prev => new Set(prev).add(user.id))
            onFriendAdded()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send request')
        }
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Input
                    label="Find Friends"
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={query}
                    onChange={handleInputChange}
                    icon={<Search className="w-4 h-4" />}
                />
                {isSearching && (
                    <div className="absolute right-3 top-[34px]">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    </div>
                )}
            </div>

            {error && (
                <div className="text-sm p-3 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {error}
                </div>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {results.length > 0 ? (
                    results.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full" />
                                    ) : (
                                        <User className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-medium text-slate-200 truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant={sentRequests.has(user.id) ? "success" : "primary"}
                                onClick={() => sendRequest(user)}
                                disabled={sentRequests.has(user.id)}
                                className="shrink-0"
                            >
                                {sentRequests.has(user.id) ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    ))
                ) : query.length >= 2 && !isSearching ? (
                    <div className="text-center py-4 text-slate-500 text-sm">
                        No users found matching "{query}"
                    </div>
                ) : null}
            </div>
        </div>
    )
}
