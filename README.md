# Simple Newtab

## Installation

- [microsoft edge](https://microsoftedge.microsoft.com/addons/detail/simple-newtab/pmldkljjfgngoidjkbjjfnipaocgpdkh)
- [firefox](https://addons.mozilla.org/zh-CN/firefox/addon/simple-newtab/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)

### Statistics

统计项目文件数和代码行数（不包括 git 忽略的部分）：

```powershell
(git ls-files | ForEach-Object { (Get-Content $_ | Measure-Object -Line).Lines }) | Measure-Object -Sum
```