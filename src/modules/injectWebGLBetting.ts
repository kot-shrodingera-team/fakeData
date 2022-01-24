import FakeProfile from '../FakeProfile';

const injectWebGl = (fakeProfile: FakeProfile): void => {
  if (
    !('WebGlStatus' in fakeProfile) ||
    !('WebGlVideoCard' in fakeProfile) ||
    !('WebGlValues' in fakeProfile) ||
    fakeProfile.WebGlStatus !== 0 ||
    fakeProfile.WebGlVideoCard === 'System VideoCard' ||
    fakeProfile.WebGlVideoCard === ''
  ) {
    return;
  }
  const webglUtil = {
    random: {
      value() {
        return Math.random();
      },
      item(e: number[]) {
        const rand = e.length * webglUtil.random.value();
        return e[Math.floor(rand)];
      },
      array(e: number[]) {
        const rand = webglUtil.random.item(e);
        return new Int32Array([rand, rand]);
      },
      items(e: unknown[], n: number) {
        let { length } = e;
        const result = new Array(n);
        const taken = new Array(length);
        if (n > length) {
          // eslint-disable-next-line no-param-reassign
          n = length;
        }
        //
        // eslint-disable-next-line no-plusplus, no-param-reassign
        while (n--) {
          const i = Math.floor(webglUtil.random.value() * length);
          result[n] = e[i in taken ? taken[i] : i];
          // eslint-disable-next-line no-plusplus
          taken[i] = --length in taken ? taken[length] : length;
        }
        return result;
      },
    },
    spoof: {
      webgl: {
        extensions(
          target: typeof WebGLRenderingContext | typeof WebGL2RenderingContext
        ) {
          const extensions = [
            'ANGLE_instanced_arrays',
            'EXT_blend_minmax',
            'EXT_color_buffer_half_float',
            'EXT_disjoint_timer_query',
            'EXT_float_blend',
            'EXT_frag_depth',
            'EXT_shader_texture_lod',
            'EXT_texture_compression_bptc',
            'EXT_texture_compression_rgtc',
            'EXT_texture_filter_anisotropic',
            'WEBKIT_EXT_texture_filter_anisotropic',
            'EXT_sRGB',
            'KHR_parallel_shader_compile',
            'OES_element_index_uint',
            'OES_fbo_render_mipmap',
            'OES_standard_derivatives',
            'OES_texture_float',
            'OES_texture_float_linear',
            'OES_texture_half_float',
            'OES_texture_half_float_linear',
            'OES_vertex_array_object',
            'WEBGL_color_buffer_float',
            'WEBGL_compressed_texture_s3tc',
            'WEBKIT_WEBGL_compressed_texture_s3tc',
            'WEBGL_compressed_texture_s3tc_srgb',
            'WEBGL_debug_renderer_info',
            'WEBGL_debug_shaders',
            'WEBGL_depth_texture',
            'WEBKIT_WEBGL_depth_texture',
            'WEBGL_draw_buffers',
            'WEBGL_lose_context',
            'WEBKIT_WEBGL_lose_context',
            'WEBGL_multi_draw',
          ];
          Object.defineProperty(target.prototype, 'getSupportedExtensions', {
            value() {
              return extensions;
            },
          });
        },
        buffer(
          target: typeof WebGLRenderingContext | typeof WebGL2RenderingContext
        ) {
          const { bufferData } = target.prototype;
          Object.defineProperty(target.prototype, 'bufferData', {
            value(_target: GLenum, srcData: number[]) {
              let fakeNoise = fakeProfile.WebGlValues[0];
              while (fakeNoise > 1) {
                fakeNoise *= 0.1;
              }
              fakeNoise *= 0.1;

              srcData.forEach((val: number, index: number) => {
                if (val === 0) {
                  return;
                }
                const noise = fakeNoise * val;
                // eslint-disable-next-line no-param-reassign
                srcData[index] += noise;
              });

              // eslint-disable-next-line prefer-rest-params
              return bufferData.apply(this, arguments);
            },
          });
        },
        parameter(
          target: typeof WebGLRenderingContext | typeof WebGL2RenderingContext
        ) {
          const { getParameter } = target.prototype;
          Object.defineProperty(target.prototype, 'getParameter', {
            configurable: false,
            enumerable: true,
            writable: true,
            value(pname: GLenum) {
              // const float32array = new Float32Array([1, 8192]);
              if (pname === 37446) {
                return fakeProfile.WebGlVideoCard;
              }
              if (pname === 37445) {
                return 'Google inc.';
              }

              if (fakeProfile.WebGlValues[pname] && pname !== 0) {
                return fakeProfile.WebGlValues[pname];
              }

              return getParameter.apply(this, [pname]);
            },
          });
        },
      },
    },
  };

  webglUtil.spoof.webgl.extensions(WebGLRenderingContext);
  webglUtil.spoof.webgl.extensions(WebGL2RenderingContext);
  webglUtil.spoof.webgl.buffer(WebGLRenderingContext);
  webglUtil.spoof.webgl.buffer(WebGL2RenderingContext);
  webglUtil.spoof.webgl.parameter(WebGLRenderingContext);
  webglUtil.spoof.webgl.parameter(WebGL2RenderingContext);
};

export default injectWebGl;
