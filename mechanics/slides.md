!SLIDE bullets incremental

# Getting started with add-ons

* Dirty little secret
   * No difference between simple and advanced add-ons
   * Just what code they generate
* Each add-on can inject the necessary beans

!SLIDE

# Add-ons are OSGi bundles

* To understand this we have to detour
* What is OSGi in the context of Roo?

!SLIDE

# OSGi in 5 minutes (really)

* OSGi - dynamic module loading system
  * `Bundle` = Jar w/instructions (`META-INF/MANIFEST.MF`  )
  * `OSGi Container` - a runtime platform (Apache Felix)
  * `OSGi Shell` - command line exposed by container
* Roo uses OSGi to mount and expose commands
* Roo does *not* use OSGi in production

!SLIDE full-screen

# OSGi's dreaded `META-INF/MANIFEST.MF`

<img src="manifest-created.jpg" height="500" style="border: 1px solid black;"/>

!SLIDE full-screen

# Roo and OSGi bundles

<img src="roo-bundles.jpg" height="500" style="border: 1px solid black;" />