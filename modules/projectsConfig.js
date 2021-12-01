const config = {
	common: {
		pages: {
			index: {
			  entry: "src/common/main.js",
			  template: "public/index.html",
			  filename: "index.html"
			}
		},
		devServer: {
			port: 8082, // 端口地址
			open: false, // 是否自动打开浏览器页面
			host: "0.0.0.0", // 指定使用一个 host，默认是 localhost
			http: false, // 使用https提供服务
			disableHostCheck: true,
			chainWebpack: (config) => {
				config.resolve.alias
					.set('@', resolve('src'))
			},
			// 设置代理
			proxy: {
				"/eopenhapi": {
					target: "http://open.jdpay.com",
					changeOrigin: true
				},
				"/hapi": {
					target: "http://open.jdpay.com",
					changeOrigin: true
				}
			}
		}
	},
	device: {
	  pages: {
	    index: {
	      entry: "src/device/main.js",
	      template: "public/index.html",
	      filename: "index.html"
	    }
	  },
	  devServer: {
	    port: 8082, // 端口地址
	    open: false, // 是否自动打开浏览器页面
	    host: "0.0.0.0", // 指定使用一个 host，默认是 localhost
	    https: false, // 使用https提供服务
	    disableHostCheck: true,
	    // 设置代理
	    proxy: {
	      "/eopenhapi": {
	        target: "http://open.jdpay.com",
	        changeOrigin: true
	      },
	      "/hapi": {
	        target: "http://open.jdpay.com",
	        changeOrigin: true
	      }
	    }
	  }
	},
	confess: {
	  pages: {
	    index: {
	      entry: "src/confess/main.js",
	      template: "public/index.html",
	      filename: "index.html"
	    }
	  },
	  devServer: {
	    port: 8082, // 端口地址
	    open: false, // 是否自动打开浏览器页面
	    host: "0.0.0.0", // 指定使用一个 host，默认是 localhost
	    https: false, // 使用https提供服务
	    disableHostCheck: true,
	    // 设置代理
	    proxy: {
	      "/eopenhapi": {
	        target: "http://open.jdpay.com",
	        changeOrigin: true
	      },
	      "/hapi": {
	        target: "http://open.jdpay.com",
	        changeOrigin: true
	      }
	    }
	  }
	},
	frequency: {
	  pages: {
	    index: {
	      entry: "src/frequency/main.js",
	      template: "public/index.html",
	      filename: "index.html"
	    }
	  },
	  devServer: {
	    port: 8082, // 端口地址
	    open: false, // 是否自动打开浏览器页面
	    host: "0.0.0.0", // 指定使用一个 host，默认是 localhost
	    https: false, // 使用https提供服务
	    disableHostCheck: true,
	    // 设置代理
	    proxy: {
	      "/eopenhapi": {
	        target: "http://open.jdpay.com",
	        changeOrigin: true
	      },
	      "/hapi": {
	        target: "http://open.jdpay.com",
	        changeOrigin: true
	      }
	    }
	  }
	},
	reward: {
		pages: {
			index: {
				entry: "src/reward/main.js",
				template: "public/index.html",
				filename: "index.html"
			}
		},
		devServer: {
			port: 8082, // 端口地址
			open: false, // 是否自动打开浏览器页面
			host: "0.0.0.0", // 指定使用一个 host，默认是 localhost
			https: false, // 使用https提供服务
			disableHostCheck: true,
			// 设置代理
			proxy: {
				"/eopenhapi": {
					target: "http://open.jdpay.com",
					changeOrigin: true
				},
				"/hapi": {
					target: "http://open.jdpay.com",
					changeOrigin: true
				}
			}
		}
	},
	clockIn: {
	  pages: {
	    index: {
	      entry: "src/clockIn/main.js",
	      template: "public/index.html",
	      filename: "index.html"
	    }
	  },
	  devServer: {
	    port: 8082, // 端口地址
	    open: false, // 是否自动打开浏览器页面
	    host: "0.0.0.0", // 指定使用一个 host，默认是 localhost
	    https: false, // 使用https提供服务
	    disableHostCheck: true,
	    // 设置代理
	    proxy: {
	      "/eopenhapi": {
	        target: "http://open.jdpay.com",
	        changeOrigin: true
	      },
	      "/hapi": {
	        target: "http://open.jdpay.com",
	        changeOrigin: true
	      }
	    }
	  }
	},
	companyClock: {
	  pages: {
	    index: {
	      entry: "src/companyClock/main.js",
	      template: "public/index.html",
	      filename: "index.html"
	    }
	  },
	  devServer: {
	    port: 8082, // 端口地址
	    open: false, // 是否自动打开浏览器页面
	    host: "0.0.0.0", // 指定使用一个 host，默认是 localhost
	    https: false, // 使用https提供服务
	    disableHostCheck: true,
	    // 设置代理
	    proxy: {
	      "/eopenhapi": {
	        target: "http://open.jdpay.com",
	        changeOrigin: true
	      },
	      "/hapi": {
	        target: "http://open.jdpay.com",
	        changeOrigin: true
	      }
	    }
	  }
	},
    dataCollection: {
        pages: {
            index: {
                entry: "src/dataCollection/main.js",
                template: "public/index.html",
                filename: "index.html"
            }
        },
        devServer: {
            port: 8082, // 端口地址
            open: false, // 是否自动打开浏览器页面
            host: "0.0.0.0", // 指定使用一个 host，默认是 localhost
            https: false, // 使用https提供服务
            disableHostCheck: true,
            // 设置代理
            proxy: {
                "/eopenhapi": {
                    target: "http://open.jdpay.com",
                    changeOrigin: true
                },
                "/hapi": {
                    target: "http://open.jdpay.com",
                    changeOrigin: true
                }
            }
        }
    },
	dataColl: {
	    pages: {
	        index: {
	            entry: "src/dataColl/main.js",
	            template: "public/index.html",
	            filename: "index.html"
	        }
	    },
	    devServer: {
	        port: 8082, // 端口地址
	        open: false, // 是否自动打开浏览器页面
	        host: "0.0.0.0", // 指定使用一个 host，默认是 localhost
	        https: false, // 使用https提供服务
	        disableHostCheck: true,
	        // 设置代理
	        proxy: {
	            "/eopenhapi": {
	                target: "http://open.jdpay.com",
	                changeOrigin: true
	            },
	            "/hapi": {
	                target: "http://open.jdpay.com",
	                changeOrigin: true
	            }
	        }
	    }
	},
};
module.exports = config;
