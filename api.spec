# -*- mode: python -*-

block_cipher = None


a = Analysis(['py/api.py'],
             pathex=['D:\project\electronjs\electronjs-angularjs\py'],
             binaries=[],
             datas=[],
             hiddenimports=['pandas._libs.tslibs.timedeltas', 'pandas._libs.tslibs.np_datetime', 'pandas._libs.skiplist', 'email.mime.multipart', 'email.mime.message', 'email.mime.text', 'email.mime.image', 'email.mime.audio'],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          exclude_binaries=True,
          name='api',
          debug=False,
          strip=False,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               name='api')
