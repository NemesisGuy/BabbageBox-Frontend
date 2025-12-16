import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MemoryManager from '../MemoryManager.vue'

const mockMemories = [
  {
    id: 1,
    content: 'First memory',
    conversation_id: 101,
    created_at: '2025-01-01T12:00:00Z',
  },
  {
    id: 2,
    content: 'Second memory regarding AI',
    conversation_id: 102,
    created_at: '2025-01-02T12:00:00Z',
  },
]

// Mock fetch globally
const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)

const mountOptions = {
  global: {
    stubs: {
      Teleport: { template: '<div><slot /></div>' },
    },
  },
}

describe('MemoryManager', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    // Default success with empty list
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [],
    })
  })

  it('renders correctly', async () => {
    const wrapper = mount(MemoryManager, mountOptions)
    await flushPromises()
    expect(wrapper.find('h3').text()).toBe('Memory Management')
    expect(wrapper.find('.search-box').exists()).toBe(true)
  })

  it('fetches memories on mount', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMemories,
    })

    const wrapper = mount(MemoryManager, mountOptions)

    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/api/memory')
    expect(wrapper.text()).toContain('First memory')
    expect(wrapper.text()).toContain('Second memory regarding AI')
  })

  it('filters memories based on search query', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMemories,
    })

    const wrapper = mount(MemoryManager, mountOptions)
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue('Second')

    expect(wrapper.text()).not.toContain('First memory')
    expect(wrapper.text()).toContain('Second memory')
  })

  it('deletes a memory', async () => {
    // 1. Initial fetch
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMemories,
    })

    // Mock confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true)

    const wrapper = mount(MemoryManager, mountOptions)
    await flushPromises()

    // 2. Mock delete response
    fetchMock.mockResolvedValueOnce({
      ok: true,
    })

    const deleteBtns = wrapper.findAll('.btn-aurora')
    if (deleteBtns.length === 0) throw new Error('Delete buttons not found')
    await deleteBtns[0].trigger('click')

    await flushPromises()

    expect(window.confirm).toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/memory/1',
      {
        method: 'DELETE',
      }
    )

    // UI update (local filter)
    expect(wrapper.text()).not.toContain('First memory')
    expect(wrapper.text()).toContain('Second memory')
  })

  it('updates a memory', async () => {
    // 1. Initial fetch
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMemories,
    })

    const wrapper = mount(MemoryManager, mountOptions)
    await flushPromises()

    // Open modal
    const editBtns = wrapper.findAll('.btn-ghost')
    if (editBtns.length === 0) throw new Error('Edit buttons not found')
    await editBtns[0].trigger('click')

    // 2. Mock update response
    const updatedMemory = { ...mockMemories[0], content: 'Updated content' }
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedMemory,
    })
    // Modal should appear
    expect(wrapper.find('.edit-modal').exists()).toBe(true)

    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.element.value).toBe('First memory')

    await textarea.setValue('Updated content')

    // Save
    await wrapper.find('.nemesis-btn-primary').trigger('click')
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/memory/1',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Updated content' }),
      }
    )

    expect(wrapper.find('.edit-modal').exists()).toBe(false)
    expect(wrapper.text()).toContain('Updated content')
  })
})
