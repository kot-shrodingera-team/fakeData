import FakeProfile from '../FakeProfile';

const injectWebGL = (fakeProfile: FakeProfile): void => {
  const webglstatus = fakeProfile.WebGL.Status;
  if (webglstatus === 'Disabled') {
    return;
  }
  const webglParams = fakeProfile.WebGL.Params;
  const webglUtil = {
    random: {
      value() {
        return Math.random();
      },
      item(e: any) {
        const rand = e.length * webglUtil.random.value();
        return e[Math.floor(rand)];
      },
      array(e: any) {
        const rand = webglUtil.random.item(e);
        return new Int32Array([rand, rand]);
      },
      items(e: any, n: any = 0) {
        let { length } = e;
        const result = new Array(n);
        const taken = new Array(length);
        if (n > length) {
          // eslint-disable-next-line no-param-reassign
          n = length;
        }
        //
        while (n > 1) {
          // eslint-disable-next-line no-param-reassign
          n -= 1;
          const i = Math.floor(webglUtil.random.value() * length);
          result[n] = e[i in taken ? taken[i] : i];
          // eslint-disable-next-line no-plusplus
          taken[i] = --length in taken ? taken[length] : length;
        }
        //
        return result;
      },
    },
    spoof: {
      webgl: {
        extensions(target: any) {
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
            value: extensions,
          });
        },
        buffer(target: any) {
          const { bufferData } = target.prototype;
          Object.defineProperty(target.prototype, 'bufferData', {
            value(...args: any[]) {
              const noise = fakeProfile.WebGL.Noise;
              const noiseindex = noise.Index;
              const noiseDiff = 0.1 * noise.Difference * args[1][noiseindex];
              // eslint-disable-next-line no-param-reassign
              args[1][noiseindex] += noiseDiff;
              return bufferData.apply(this, args);
            },
          });
        },
        parameter(target: any) {
          const { getParameter } = target.prototype;
          Object.defineProperty(target.prototype, 'getParameter', {
            configurable: false,
            enumerable: true,
            writable: true,
            value(...args: number[]) {
              const webglCode = args[0];
              if (webglParams[webglCode]) {
                return webglParams[webglCode].Value;
              }

              // const float32array = new Float32Array([1, 8192]);
              // //
              // if (webglCode === 3415) {
              //   return 0;
              // }
              // if (webglCode === 3414) {
              //   return 24;
              // }
              // if (webglCode === 35661) {
              //   return webglUtil.random.items([128, 192, 256]);
              // }
              // if (webglCode === 3386) {
              //   return webglUtil.random.array([8192, 16384, 32768]);
              // }
              // if (webglCode === 36349 || webglCode === 36347) {
              //   return webglUtil.random.item([4096, 8192]);
              // }
              // if (webglCode === 34047 || webglCode === 34921) {
              //   return webglUtil.random.items([2, 4, 8, 16]);
              // }
              // if (
              //   webglCode === 7937 ||
              //   webglCode === 33901 ||
              //   webglCode === 33902
              // ) {
              //   return float32array;
              // }
              // if (
              //   webglCode === 34930 ||
              //   webglCode === 36348 ||
              //   webglCode === 35660
              // ) {
              //   return webglUtil.random.item([16, 32, 64]);
              // }
              // if (
              //   webglCode === 34076 ||
              //   webglCode === 34024 ||
              //   webglCode === 3379
              // ) {
              //   return webglUtil.random.item([16384, 32768]);
              // }
              // if (
              //   webglCode === 3413 ||
              //   webglCode === 3412 ||
              //   webglCode === 3411 ||
              //   webglCode === 3410 ||
              //   webglCode === 34852
              // ) {
              //   return webglUtil.random.item([2, 4, 8, 16]);
              // }
              // return webglUtil.random.item([
              //   0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096,
              // ]);
              // //
              return getParameter.apply(this, args);
            },
          });
        },
      },
    },
  };
  //
  webglUtil.spoof.webgl.extensions(WebGLRenderingContext);
  webglUtil.spoof.webgl.extensions(WebGL2RenderingContext);
  webglUtil.spoof.webgl.buffer(WebGLRenderingContext);
  webglUtil.spoof.webgl.buffer(WebGL2RenderingContext);
  webglUtil.spoof.webgl.parameter(WebGLRenderingContext);
  webglUtil.spoof.webgl.parameter(WebGL2RenderingContext);
  //
};

export default injectWebGL;
