import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MainChat from '../MainChat.vue'

// Mock fetch globally
const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)

const mountOptions = {
  global: {
    stubs: {
      Sidebar: { template: '<div>Sidebar</div>' },
      ChatArea: { template: '<div>ChatArea</div>' },
      ModelSelector: { template: '<div>ModelSelector</div>' },
      Teleport: { template: '<div><slot /></div>' },
    },
  },
}

describe('MainChat', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    // Mock successful responses
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })
  })

  it('updates model name when model is set', async () => {
    // Mock config response with Gemma model
    fetchMock.mockImplementation((url) => {
      if (url === 'http://localhost:8000/api/config') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            llama_model_path: 'models/gemma-2b.Q4_K_M.gguf',
          }),
        })
      }
      if (url === 'http://localhost:8000/api/conversations') {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      })
    })

    const wrapper = mount(MainChat, mountOptions)
    await flushPromises()

    // Initially should fetch model on mount
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/api/config')

    // Get the component instance and call onModelSet directly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    await vm.fetchModel()
    await flushPromises()

    // Should fetch config again to update model name
    expect(fetchMock).toHaveBeenCalledTimes(3) // config, conversations, config again
  })

  it('fetches model on mount', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          llama_model_path: 'models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

    mount(MainChat, mountOptions)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/api/config')
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/conversations'
    )
  })

  it('uses fallback model name when API returns empty', async () => {
    // Mock config response with no current_model
    fetchMock.mockImplementation((url) => {
      if (url === 'http://localhost:8000/api/config') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            llama_model_path: '',
            current_model: '', // Empty model name
          }),
        })
      }
      if (url === 'http://localhost:8000/api/conversations') {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      })
    })

    const wrapper = mount(MainChat, mountOptions)
    await flushPromises()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    // modelName should be 'Unknown' (from API fallback) or ''
    // The fallback 'BabbageBox AI' is used in message creation, not in modelName ref
    expect(vm.modelName === '' || vm.modelName === 'Unknown').toBe(true)
  })

  it('uses fallback model name when API returns null', async () => {
    // Mock config response with null current_model
    fetchMock.mockImplementation((url) => {
      if (url === 'http://localhost:8000/api/config') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            llama_model_path: 'models/test.gguf',
            current_model: null, // Null model name
          }),
        })
      }
      if (url === 'http://localhost:8000/api/conversations') {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      })
    })

    const wrapper = mount(MainChat, mountOptions)
    await flushPromises()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    // Should fall back to 'Unknown' per fetchModel logic
    expect(vm.modelName).toBe('Unknown')
  })

  it('correctly sets model name from API response', async () => {
    // Mock config response with valid current_model
    fetchMock.mockImplementation((url) => {
      if (url === 'http://localhost:8000/api/config') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            llama_model_path: 'models/phi-2.Q4_K_M.gguf',
            current_model: 'phi-2.Q4_K_M.gguf',
          }),
        })
      }
      if (url === 'http://localhost:8000/api/conversations') {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      })
    })

    const wrapper = mount(MainChat, mountOptions)
    await flushPromises()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    expect(vm.modelName).toBe('phi-2.Q4_K_M.gguf')
  })

  it('initializes with default chat profile', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ current_model: 'test-model' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

    const wrapper = mount(MainChat, mountOptions)
    await flushPromises()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    expect(vm.currentProfile).toBe('chat')
  })
})
