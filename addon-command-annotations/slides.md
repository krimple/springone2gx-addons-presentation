!SLIDE center

# CLI command annotations

!SLIDE

# Key annotations

* `@CliAvailabilityIndicator` - Is the command (or list of commands) available?
* `@CliCommand` - Expose a command to the shell
* `@CliOption` - Expose command-line options for the given command

!SLIDE

# More complex example

    @@@java
    @CliCommand(value = "coffeescript addjoinset", help="...")

    public void addJoinSet(
      @CliOption(key = "joinSetId", mandatory = true, 
         specifiedDefaultValue = "main")

      String joinSetId,
      @CliOption(key = "directory", mandatory = false, 
         unspecifiedDefaultValue = "/scripts",
          help = "directory to use as root of...")          
      String directory,

      ...) {

    operations.addJoinSet(joinSetId, directory, includes, excludes);

!SLIDE

# Picking sets of options

    @@@java
    
    @CliCommand(value = "say hello", 
       help = "Prints welcome message to the Roo shell")
    public void sayHello(

      @CliOption(key = "name", 
                 mandatory = true, 
                 help = "State your name") 
      String name, 

      @CliOption(key = "countryOfOrigin", 
                 mandatory = false, 
                 help = "Country of orgin") 
      AddonsPropertyName country) {
        ...
    }
  
!SLIDE 

# The `AddonsPropertyName` Country enum

    @@@java
    public enum AddonsPropertyName {
      AUSTRALIA("Australia"),
      UNITED_STATES("United States"),
      GERMANY("Germany"),
      NOT_SPECIFIED("None of your business!");
      
      private String propertyName;
      
      private AddonsPropertyName(String propertyName) {
          Validate.notBlank(propertyName, "Property name required");
          this.propertyName = propertyName;
      }
      
      public String toString() {
          return propertyName;
      }
    }

!SLIDE center

# Dynamic attribute fill-in

!SLIDE bullets
# Key Components
* Converters
   * Convert from text in the Roo Shell to Java types, _and_
   * Provides list of possible completion values, based on text entered so far
   * Similar to Spring converters, but not the same

* Target datatypes as Shell `@CliOption` param types
   * Built-in converters selected automatically
   * Your converter must be registered as a `@Component` and `@Service`


!SLIDE

# The `Converter` interface

    @@@java
    public interface Converter<T> {
      T convertFromText(String value, Class<?> targetType, 
                        String optionContext);

      boolean getAllPossibleValues(
        List<Completion> completions,
        Class<?> targetType,
        String existingData, String optionContext, 
        MethodTarget target);

      boolean supports(Class<?> type, String optionContext);
    }

!SLIDE
.notes This one does not use the option context data

# Built-in - BooleanConverter - `convertFromText`
.notes Makes the input more flexible

    @@@java
    public Boolean convertFromText(final String value,
            final Class<?> requiredType, final String optionContext) {
        if ("true".equalsIgnoreCase(value) || "1".equals(value)
                || "yes".equalsIgnoreCase(value)) {
            return true;
        }
        else if ("false".equalsIgnoreCase(value) || "0".equals(value)
                || "no".equalsIgnoreCase(value)) {
            return false;
        }
        else {
            throw new IllegalArgumentException("Cannot convert " + value
                    + " to type Boolean.");
        }
    }


!SLIDE

# Converters built-in for

* Java Datatypes
  * `BigDecimal`, `BigInteger`, `Boolean`, `Character`, `Date`, `Double`, `Float`, `Integer`, `Long`, `Short`, `String`
* Files
  * The `FileConverter` can do completions based on files in the directory
* Other key converters
  * `Locale`, `Static Fields`, `Enum`

* Available Commands via `AvailableCommandsConverter`


!SLIDE 

# Example - Cloud Foundry Add-on URI Converter
.notes They extend `Converter` and mount as a Service Component for the given type

    @@@java
    @Component
    @Service
    public class CloudUriConverter implements Converter<CloudUri> {

        @Reference private CloudFoundrySession session;

        public CloudUri convertFromText(...);

        public boolean getAllPossibleValues(...);

        public boolean supports(final Class<?> requiredType,
            final String optionContext) {
              return CloudUri.class.isAssignableFrom(requiredType)
        }
    }

!SLIDE 

# Converting from text to an object of type `CloudUri`

    @@@java
    public CloudUri convertFromText(
            final String value,
            final Class<?> requiredType, 
            final String optionContext) {
      if (StringUtils.isBlank(value)) {
          return null;
      }
      return new CloudUri(value);
    }

!SLIDE
.notes Return type tells shell whether further completions (digging deeper) are possible
# Providing fill-in features during command completion

    @@@java
    public boolean getAllPossibleValues(final List<Completion> completions,
            final Class<?> requiredType, final String existingData,
            final String optionContext, final MethodTarget target) {
        
        final String appName = 
           ConverterUtils.getOptionValue("appName", target.getRemainingBuffer());

        final List<String> uris = session.getBoundUrlMap().get(appName);

        if (uris != null) {
            for (final String uri : uris) {
                completions.add(new Completion(uri));
            }
        }
        return false;
    }



!SLIDE

# So what about this Spring Shell?

* A Shell programming interface for your own, Spring-based apps
* NOT OSGi based
* Turns out, you're learning it
* Uses `@CliCommand`, `@CliOption`, shell converters are the same
* Extracted from Spring Roo
* Now you know this too!

